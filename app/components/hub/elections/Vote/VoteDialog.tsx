import { useMutation } from 'blitz'
import NoSsr from '@mui/material/NoSsr'
import { useTheme } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import DialogActions from '@mui/material/DialogActions'
import useMediaQuery from '@mui/material/useMediaQuery'

import Close from 'mdi-material-ui/Close'

import { Candidate } from 'db'
import Snackbar from 'app/core/layouts/Snackbar'
import useSnackbar from 'app/entities/hooks/useSnackbar'
import SlideTransition from 'app/core/layouts/SlideTransition'
import createVote from 'app/entities/vote/mutations/createVote'
import VoteForm from 'app/components/hub/elections/Vote/VoteForm'

type VoteDialogProps = {
  open: boolean
  candidate?: Candidate | null
  onClose: () => void
}

export default function VoteDialog({ open, candidate, onClose }: VoteDialogProps) {
  const [createVt] = useMutation(createVote)
  const { open: snackOpen, message, severity, onShow, onClose: onSnackClose } = useSnackbar()

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'))

  const onSuccess = async ({ approve, ...data }: any) => {
    await createVt({ data })
      .then(() => {
        onShow('success', 'A voté !')
        onClose()
      })
      .catch((err) => onShow('error', err.message))
  }

  return (
    <NoSsr>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          keepMounted
          fullScreen={fullScreen}
          PaperProps={{ className: 'w-full' }}
          TransitionComponent={SlideTransition}
        >
          <DialogActions>
            <IconButton onClick={onClose} aria-label="Fermer" size="large">
              <Close />
            </IconButton>
          </DialogActions>

          <VoteForm initialValues={candidate!} onSuccess={onSuccess} onClose={onClose} />
        </Dialog>
      )}

      <Snackbar open={snackOpen} message={message} severity={severity} onClose={onSnackClose} />
    </NoSsr>
  );
}
