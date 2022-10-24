import { NextApiRequest, NextApiResponse } from 'next'

import db from 'db'
import {
  generateTopUpToken,
  makeHmac,
  makeMerchantReference,
  makeShopOrderReference,
} from 'app/core/utils/topup'

function generate_hmac(data: URLSearchParams, additionalData: string, by_credit_card: boolean): string {
  let list = [data.get('lang')]

  let common = [
    data.get('posUuid'),
    data.get('shopReference'),
    data.get('shopOrderReference'),
    data.get('deliveryFeesAmount'),
    data.get('amount'),
    data.get('currency'),
  ]

  if (by_credit_card) {
    list = list.concat(common)
    list = list.concat([
      data.get('onSuccess'),
      data.get('onError'),
      additionalData,
      data.get('callBackRequired'),
      data.get('mode'),
      data.get('address'),
      data.get('city'),
      data.get('country'),
      data.get('zipCode'),
    ])
  } else {
    list = list.concat([data.get('version'), data.get('timestamp')])
    list = list.concat(common)
    list = list.concat([
      data.get('mode'),
      data.get('onSuccess'),
      data.get('onCancel'),
      data.get('onError'),
      additionalData,
      data.get('enforcedIdentification'),
    ])
  }

  return makeHmac(list, `${process.env.LYF_API_SECRET_KEY}`)
}

function prepare_request(
  id: string,
  card: number,
  amount: number,
  byCreditCard: boolean
): URLSearchParams {
  const body = new URLSearchParams()

  const timestamp = Math.floor(+new Date() / 1000)
  const tAmount = Math.round(amount * 100)

  const shopReference = makeMerchantReference(card, timestamp)
  const shopOrderReference = makeShopOrderReference(card, tAmount)

  const token = generateTopUpToken(
    {
      userId: id,
      card,
      amount: tAmount,
      reference: shopReference,
      orderReference: shopOrderReference,
      creationDate: timestamp,
      byCreditCard,
    },
    `${process.env.SESSION_SECRET_KEY}`
  )

  const userCallbackUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/hub`
  const additionalData = `{"callbackUrl":"${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/topup/confirm/${token}"}`

  // Common request fields
  body.append('lang', 'fr')
  body.append('version', 'v2.0')
  body.append('posUuid', `${process.env.LYF_API_VENDOR_ID}`)
  body.append('shopReference', shopReference)
  body.append('shopOrderReference', shopOrderReference)
  body.append('mode', 'IMMEDIATE')
  body.append('amount', `${tAmount}`)
  body.append('deliveryFeesAmount', '0')
  body.append('currency', 'EUR')
  body.append('onSuccess', userCallbackUrl)
  body.append('onError', userCallbackUrl)
  body.append('additionalDataEncoded', Buffer.from(additionalData).toString('base64'))

  // Method-specific fields
  if (byCreditCard) {
    body.append('caseNumber', '01234')
    body.append('callBackRequired', 'true')
    body.append('country', 'FR')

    if (process.env.NODE_ENV === 'development') {
      body.append('address', '7 Some Street')
      body.append('city', 'Bigcity')
      body.append('zipCode', '01234')
    } else {
      body.append('address', '')
      body.append('city', '')
      body.append('zipCode', '')
    }
  } else {
    body.append('onCancel', userCallbackUrl)
    body.append('timestamp', `${timestamp}`)
    body.append('enforcedIdentification', 'false')
  }

  body.append('mac', generate_hmac(body, additionalData, byCreditCard))

  return body
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { body, query } = req

    const { amount, method } = body

    const id = query.userId as string
    const tAmount = parseFloat(amount)

    if (Number.isNaN(tAmount) || tAmount <= 0) {
      console.error(`Tentative rechargement d’une valeur invalide (${amount}) par ${id}`)
      res.status(400).json({ name: 'Invalid amount' })
    } else if (method == 'credit' || method == 'lyf') {
      let by_credit_card = true

      if (method == 'lyf') {
        by_credit_card = false
      }

      const user = await db.user.findUnique({ where: { id } })

      if (user) {
        let req = prepare_request(id, user.card, tAmount, by_credit_card)

        let link = `${(by_credit_card)
          ? process.env.LYF_CREDIT_CARD_API_URL
          : process.env.LYF_FROM_APPLICATION_API_URL}?${req.toString()}`

        res.status(200).json({ urlRequest: link })
      } else {
        console.error(`L’utilisateur ${id} est inconnu`)
        res.status(404).json({ name: 'Unknown user' })
      }
    } else {
      console.error(`Le type de requête ${method} est invalide. N’est possible que cb ou lyf`)
      res.status(400).json({ name: 'Invalid method' })
    }
  } else {
    res.status(400).send('BAD REQUEST')
  }
}
