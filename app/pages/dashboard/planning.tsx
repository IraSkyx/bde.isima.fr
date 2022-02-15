import { BlitzPage, Routes } from 'blitz'

import getDashboardNav             from 'app/components/nav/dashboard/getDashboardNav'
import { redirectAuthenticatedTo } from 'app/components/nav/dashboard/bde-config'
import { format }                  from "date-fns";
import getServices                 from "../../entities/planning/queries/getServices";
import deleteManyServices          from "../../entities/planning/mutations/deleteManyServices";
import Table                       from "../../components/dashboard/data/Table";
import upsertService               from "../../entities/planning/mutations/upsertService";
import ServiceForm                 from 'app/components/dashboard/planning/ServiceForm'

const Planning: BlitzPage = () => {
  return (
    <Table
      title="Permanences"
      columns={columns}
      queryKey="services"
      getQuery={getServices}
      upsertQuery={upsertService}
      deleteQuery={deleteManyServices}
      FormComponent={ServiceForm}
    />
  )
}

Planning.suppressFirstRenderFlicker = true
Planning.authenticate               = { redirectTo: Routes.Login() }
Planning.redirectAuthenticatedTo    = redirectAuthenticatedTo(Routes.Planning())
Planning.getLayout                  = (page) => getDashboardNav(page, 'Gestion des plannings')

const columns = [
  {
    id        : 'startDate',
    headerName: "Début de la permanence",
    render    : (row) => format(row.startDate, 'dd/MM/yyyy - HH:mm'),
  },
  {
    id        : 'endDate',
    headerName: 'Fin de la permanence',
    render    : (row) => format(row.endDate, 'dd/MM/yyyy - HH:mm'),
  },
]

export default Planning
