import { resolver } from 'blitz'

import db, { Prisma } from 'db'

type DeleteTransactionInput = Pick<Prisma.TransactionDeleteArgs, 'where'>

export default resolver.pipe(
  resolver.authorize(['*', 'bde']),
  async ({ where }: DeleteTransactionInput) => {
    const transaction = await db.transaction.findUnique({
      where,
      include: { user: { include: { userStats: true } } },
      rejectOnNotFound: true,
    })

    if (!transaction.articleId) {
      throw new Error('Transaction non annulable')
    }

    let userStats
    const amount = transaction.amount

    if (transaction.user.userStats?.articlesStats) {
      transaction.user.userStats.articlesStats[transaction.articleId] -= 1

      //Decrement article stats
      userStats = await db.userStats.update({
        data: { articlesStats: transaction.user.userStats.articlesStats },
        where: { id: transaction.user.userStats?.id },
      })
    }

    const [user, oldTransaction] = await Promise.all([
      // Refund user
      db.user.update({
        data: { balance: { [transaction.type === 'CREDIT' ? 'decrement' : 'increment']: amount } },
        where: { id: transaction.userId },
      }),
      //Delete transaction
      db.transaction.delete({ where }),
    ])

    return {
      user,
      userStats,
      oldTransaction,
    }
  }
)
