import Paper from '@mui/material/Paper'
import sanitizeHtml from 'sanitize-html'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'

import Close from '@mui/icons-material/CloseTwoTone'

import type { CarouselItemType } from './index'
import { useTheme } from 'app/core/styles/theme'
import SlideTransition from 'app/core/layouts/SlideTransition'

interface CarouselDialogProps {
  open: boolean
  onClose: () => void
}

const CarouselDialog = <ItemType extends CarouselItemType>({
  open,
  item,
  onClose,
}: CarouselDialogProps & {
  item?: ItemType
}) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'))

  return (
    <Dialog
      maxWidth="lg"
      scroll="body"
      open={open}
      TransitionComponent={SlideTransition}
      PaperProps={{ className: 'md:w-3/4' }}
      fullScreen={fullScreen}
      keepMounted
      onClose={onClose}
      aria-labelledby="carousel-dialog-title"
      aria-describedby="carousel-dialog-description"
    >
      <IconButton
        className="z-10 absolute top-6 right-6 bg-gray-700/40 text-white"
        onClick={onClose}
        aria-label="Fermer"
        size="large"
      >
        <Close />
      </IconButton>

      <DialogTitle id="carousel-dialog-title" className="p-0">
        <Paper
          className="relative bg-gray-800 text-white mb-8 bg-cover bg-no-repeat bg-top h-96"
          sx={{ backgroundImage: `url(${item?.image})` }}
        >
          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute bottom-0 p-6">
            <Typography component="h1" variant="h4" color="inherit" gutterBottom>
              {item?.name.toUpperCase()}
            </Typography>
            {item?.email && (
              <Typography variant="subtitle2" color="inherit">
                {item.email}
              </Typography>
            )}
          </div>
        </Paper>
      </DialogTitle>

      <DialogContent className="md:px-16">
        <DialogContentText id="carousel-dialog-description" component="div">
          <Typography
            variant="body2"
            component="div"
            align="justify"
            paragraph
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(item?.description, {
                allowedTags: [
                  'h1',
                  'h2',
                  'h3',
                  'h4',
                  'h5',
                  'h6',
                  'blockquote',
                  'p',
                  'a',
                  'ul',
                  'ol',
                  'nl',
                  'li',
                  'b',
                  'i',
                  'strong',
                  'em',
                  'strike',
                  'code',
                  'hr',
                  'br',
                  'div',
                  'table',
                  'thead',
                  'caption',
                  'tbody',
                  'tr',
                  'th',
                  'td',
                  'pre',
                  'iframe',
                  'img',
                ],
                allowedAttributes: {
                  a: ['href', 'target'],
                  img: ['src', 'alt', 'style'],
                  iframe: [
                    'width',
                    'height',
                    'src',
                    'frameborder',
                    'allow',
                    'allowfullscreen',
                    'style',
                  ],
                },
                allowedIframeHostnames: ['www.youtube.com'],
              }),
            }}
          />
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}

export default CarouselDialog
