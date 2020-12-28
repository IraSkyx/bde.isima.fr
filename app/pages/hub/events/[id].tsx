import Divider from '@material-ui/core/Divider'
import { GetStaticProps, GetStaticPaths } from 'next'
import { BlitzPage, useRouter, InferGetStaticPropsType } from 'blitz'

import db from 'db'
import Header from 'app/components/hub/events/Header'
import Cart from 'app/components/hub/events/cart/Cart'
import ProductsList from 'app/components/hub/events/product/ProductsList'
import { convertDatesToStrings, convertStringsToDate } from 'utils/convertDatesToStrings'
import { EventSubscriptionProvider } from 'app/components/hub/events/subscription/EventSubscription'

const Event: BlitzPage = ({ event }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter()
  const evt = convertStringsToDate(event) as any

  return (
    <div
      className="flex flex-col-reverse md:grid md:gap-16 mb-20"
      style={{ gridTemplateColumns: "1fr 310px" }}
    >
      <EventSubscriptionProvider eventId={evt?.id}>
        <main className="flex flex-col">
          <Header event={evt} isFetching={router.isFallback} />
          <Divider className="m-4" />
          <ProductsList event={evt} isFetching={router.isFallback} />
        </main>

        <aside>
          <Cart event={evt} />
        </aside>
      </EventSubscriptionProvider>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const events = await db.event.findMany()
  
  return {
    paths: events.map(e => ({ params: { id: e.id } })),
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const event = await db.event.findUnique({ 
    where: { id: (params?.id as string) },
    include: { club: true },
  })

  return {
    props: { event: convertDatesToStrings(event) },
    revalidate: 1,
  }
}

export default Event
