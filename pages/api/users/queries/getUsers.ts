import { NextApiRequest, NextApiResponse } from "next"

import db, { Prisma } from "db"

type GetUsersInput = Pick<
  Prisma.FindManyUserArgs,
  "where" | "orderBy" | "skip" | "take" | "include"
>

export default async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  //TODO ctx.session.authorize(['*', 'bde'])

  const { where, orderBy, skip = 0, take, include }: GetUsersInput = req.body

  const users = await db.user.findMany({
    include,
    where,
    orderBy,
    take,
    skip,
  })

  const count = await db.user.count({ where })
  const hasMore = typeof take === "number" ? skip + take < count : false
  const nextPage = hasMore ? { take, skip: skip + take! } : null

  res.status(200).json({
    users,
    nextPage,
    hasMore,
    count,
  })
}
