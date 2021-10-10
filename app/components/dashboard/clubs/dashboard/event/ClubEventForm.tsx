import { TextField } from 'mui-rff'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import { Field } from 'react-final-form'
import TabPanel from '@mui/lab/TabPanel'
import frLocale from 'date-fns/locale/fr'
import { useMemo, useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Divider from '@mui/material/Divider'
import TabContext from '@mui/lab/TabContext'
import arrayMutators from 'final-form-arrays'
import MuiTextField from '@mui/material/TextField'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import DateTimePicker from '@mui/lab/DateTimePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'

import { Event } from 'db'
import ProductsForm from './ProductsForm'
import { useRouter } from 'app/core/lib/router'
import { useTheme } from 'app/core/styles/theme'
import GroupOptionsForm from './GroupOptionsForm'
import { Form, FORM_ERROR } from 'app/components/forms/Form'
import { EventInput, EventInputType } from 'app/components/forms/validations'

type ClubEventFormProps = {
  initialValues: Event | null
  onSuccess: (values: EventInputType) => void
  onClose: () => void
}

export default function ClubEventForm(props: ClubEventFormProps) {
  const theme = useTheme()
  const { router } = useRouter()
  const [value, setValue] = useState('0')

  const handleChange = (_, newValue: string) => setValue(newValue)

  const onSubmit = async (values) => {
    try {
      await props.onSuccess({
        ...values,
        max_subscribers: parseInt(values.max_subscribers) || null,
      })
    } catch (error) {
      return {
        [FORM_ERROR]: 'Sorry, we had an unexpected error. Please try again. - ' + error.toString(),
      }
    }
  }

  const onDateChange = (onChange) => (newDate) => onChange(newDate)

  const initialValues = useMemo(
    () => ({
      id: props.initialValues?.id,
      name: props.initialValues?.name,
      description: props.initialValues?.description,
      takes_place_at: new Date(props.initialValues?.takes_place_at ?? new Date()),
      subscriptions_end_at: new Date(props.initialValues?.subscriptions_end_at ?? new Date()),
      status: props.initialValues?.status || 'WAITING_APPROVAL',
      max_subscribers: props.initialValues?.max_subscribers?.toString(),
      club: { connect: { name: `${router.query.name}` } },
      products: props.initialValues?.products
        ? (props.initialValues?.products as any[]).map((i) => ({
            name: i.name,
            description: i.description,
            price: i.price,
            groupOptions: i.groupOptions.map((go) => ({
              name: go.name,
              type: go.type,
              options: go.options?.map((o) => ({
                name: o.name,
                description: o.description,
                price: o.price,
              })),
            })),
          }))
        : [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <Form<EventInputType>
      submitText="Valider"
      variant="dialog"
      onClose={props.onClose}
      schema={EventInput}
      initialValues={initialValues}
      onSubmit={onSubmit}
      mutators={{ ...arrayMutators }}
      autoComplete="off"
    >
      <TabContext value={value}>
        <AppBar position="static" color="inherit" elevation={0}>
          <TabList
            onChange={handleChange}
            variant="fullWidth"
            textColor={theme.palette.mode === 'dark' ? 'secondary' : 'primary'}
            indicatorColor={theme.palette.mode === 'dark' ? 'secondary' : 'primary'}
            aria-label="Nav"
          >
            <Tab label="Infos" value="0" />
            <Tab label="Produits" value="1" />
            <Tab label="Options" value="2" />
          </TabList>
        </AppBar>

        <TabPanel value="0">
          <TextField type="text" name="name" label="Nom" />
          <TextField type="text" name="description" label="Description" multiline rows={5} />
          <TextField type="text" name="max_subscribers" label="Limite de participants" />

          <Divider className="m-2" />

          <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
            <Field name="takes_place_at">
              {(props) => (
                <DateTimePicker
                  label="Date de l'événement"
                  value={props.input.value}
                  onChange={onDateChange(props.input.onChange)}
                  renderInput={(tfProps) => (
                    <MuiTextField {...props} {...tfProps} helperText="JJ/MM/AAAA hh:mm" fullWidth />
                  )}
                />
              )}
            </Field>

            <Field name="subscriptions_end_at">
              {(props) => (
                <DateTimePicker
                  label="Date de fin des inscriptions"
                  value={props.input.value}
                  onChange={onDateChange(props.input.onChange)}
                  renderInput={(tfProps) => (
                    <MuiTextField {...props} {...tfProps} helperText="JJ/MM/AAAA hh:mm" fullWidth />
                  )}
                />
              )}
            </Field>
          </LocalizationProvider>
        </TabPanel>

        <TabPanel className="p-0" value="1">
          <div>
            <ProductsForm />
          </div>
        </TabPanel>

        <TabPanel className="p-0" value="2">
          <div>
            <GroupOptionsForm />
          </div>
        </TabPanel>
      </TabContext>
    </Form>
  )
}
