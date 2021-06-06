import { DefaultCtx, SessionContext } from "blitz"
import { SimpleRolesIsAuthorized } from "@blitzjs/server"

import { User, Event, EventSubscription } from "db"

declare module "blitz" {
  export interface Ctx extends DefaultCtx {
    session: SessionContext
  }
  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized
    PublicData: {
      userId: User["id"]
      firstname: string
      lastname: string
      nickname: string | null
      image: string | null
      email: string
      card: number
      roles: string[]
    }
  }
}

export interface Item {
  name: string
  description: string | null
  price: number
}

export type Option = Item

export interface GroupOption {
  name: string
  type: "combinable" | "exclusive"
  options: Option[]
}

export interface Product extends Item {
  groupOptions: GroupOption[]
}

export interface EventWithTypedProducts extends Omit<Event, "products"> {
  products: Product[]
}

export interface CartItem extends Item {
  quantity: number
  comment: string | null
  options: Option[]
}

export interface EventSubscriptionWithTypedCart extends Omit<EventSubscription, "cart"> {
  cart: CartItem[]
}
