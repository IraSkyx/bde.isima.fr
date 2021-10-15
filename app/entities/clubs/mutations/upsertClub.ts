import { resolver } from 'blitz'

import db, { Prisma } from 'db'

type UpsertClubInput = Pick<Prisma.ClubUpsertArgs, 'where' | 'create' | 'update'>

export default resolver.pipe(
  resolver.authorize(['*', 'bde']),
  async ({ where, create, update }: UpsertClubInput) => {
    return await db.club.upsert({ where, update, create })
  }
)
