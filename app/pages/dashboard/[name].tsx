import { format } from 'date-fns'
import { CsvBuilder } from 'filefy'
import { BlitzPage, Routes } from 'blitz'
import { useState, Suspense } from 'react'

import Dashboard from '@mui/icons-material/DashboardTwoTone'

import { useRouter } from 'app/core/lib/router'
import Table from 'app/components/dashboard/data/Table'
import getEvents from 'app/entities/events/queries/getEvents'
import upsertEvent from 'app/entities/events/mutations/upsertEvent'
import EventStatus from 'app/components/dashboard/events/EventStatus'
import getDashboardNav from 'app/components/nav/dashboard/getDashboardNav'
import deleteManyEvents from 'app/entities/events/mutations/deleteManyEvents'
import { redirectAuthenticatedTo } from 'app/components/nav/dashboard/clubs-config'
import Manager from 'app/components/dashboard/clubs/dashboard/event/manager/Manager'
import ClubEventForm from 'app/components/dashboard/clubs/dashboard/event/ClubEventForm'

const ClubDashboard: BlitzPage = () => {
  const { router } = useRouter()
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)

  const manage = (rowData) => () => () => {
    setOpen(true)
    setSelected(rowData)
  }

  const exportCsv = (rowData) => {
    new CsvBuilder(`${rowData.name}.csv`)
      //Default delimiter
      .setDelimeter(',')
      //We add the distinct columns to the CSV for readability considerations
      .setColumns([
        'Moyen de paiement',
        'Carte',
        'Nom',
        'Prénom',
        ...rowData.products.map((x) => x.name),
        'Total',
      ])
      //Then we add on the rows the corresponding information
      .addRows(
        rowData.EventSubscription.map((sub) => {
          return [
            sub.payment_method,
            sub.user.card,
            sub.user.lastname,
            sub.user.firstname,
            ...rowData.products.reduce((acc, curr) => {
              const items = sub.cart.filter((item) => item.name === curr.name)
              if (items.length) {
                return [
                  ...acc,
                  items
                    .map((x) =>
                      `x${x.quantity} - ${x.name} ${x.options?.map((x) => x.name).join(', ')} ${
                        x.comment ? `(${x.comment})` : ''
                      }`.trim()
                    )
                    .join('\n'),
                ]
              }
              return acc.concat('')
            }, []),
            sub.cart
              .reduce((acc, cartItem) => {
                return (
                  acc +
                  cartItem.quantity *
                    (cartItem.price +
                      (cartItem.options?.reduce((acc, o) => {
                        return acc + o.price
                      }, 0) || 0))
                )
              }, 0)
              .toFixed(2),
          ]
        })
      )
      .exportFile()
  }

  const onClose = () => setOpen(false)

  return (
    <>
      <Table
        title="Événements"
        columns={columns}
        queryKey="events"
        getQuery={getEvents}
        queryArgs={{
          where: { club: { name: router.query.name } },
          include: { EventSubscription: { include: { user: true } } },
        }}
        upsertQuery={upsertEvent}
        deleteQuery={deleteManyEvents}
        FormComponent={ClubEventForm}
        allowCopy
        onExport={exportCsv}
        actions={[
          (rowData) => ({
            icon: <Dashboard />,
            tooltip: 'Gérer',
            onClick: manage(rowData),
          }),
        ]}
      />

      <Suspense fallback={null}>
        <Manager open={open} event={selected} onClose={onClose} />
      </Suspense>
    </>
  )
}

ClubDashboard.suppressFirstRenderFlicker = true
ClubDashboard.authenticate = { redirectTo: Routes.Login() }
//ClubDashboard.redirectAuthenticatedTo = redirectAuthenticatedTo as any // FIXME
ClubDashboard.getLayout = (page) => getDashboardNav(page, 'Dashboard club')

const columns = [
  {
    id: 'name',
    headerName: 'Name',
    searchCriteria: 'contains',
  },
  {
    id: 'takes_place_at',
    headerName: "Date de l'événement",
    render: (row) => format(row.takes_place_at, 'dd/MM/yyyy - HH:mm'),
  },
  {
    id: 'subscriptions_end_at',
    headerName: "Date limite d'inscription",
    render: (row) => format(row.subscriptions_end_at, 'dd/MM/yyyy - HH:mm'),
  },
  {
    id: 'status',
    headerName: 'Statut',
    searchCriteria: 'contains',
    render: (row) => <EventStatus event={row} />,
  },
  {
    id: 'max_subscribers',
    headerName: 'Nombre max de participants',
  },
]

export default ClubDashboard
