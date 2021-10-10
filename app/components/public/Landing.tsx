import { Image } from 'blitz'
import Paper from '@mui/material/Paper'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

import { useTheme } from 'app/core/styles/theme'

export default function Landing() {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xl'))

  return (
    <Paper className="min-h-main relative">
      <a id="landing" href="#landing" />
      <Image
        alt="Fond d'écran"
        src={`/static/images/illustrations/${fullScreen ? 'MobileBackground' : 'Background'}.svg`}
        layout="fill"
        objectFit="cover"
        quality={100}
      />
      <Container className="mt-16 py-0 flex flex-col">
        <div className="flex flex-col justify-center mt-12">
          <Typography className="text-6xl text-center md:text-left" paragraph>
            <b>BDE ISIMA</b>
          </Typography>
          <Typography className="text-xl text-center md:text-left" paragraph>
            L&apos;Association des Étudiants Ingénieurs de l&apos;ISIMA
          </Typography>
        </div>
      </Container>
    </Paper>
  )
}
