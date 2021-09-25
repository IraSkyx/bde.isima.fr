import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

import Carousel from './carousel'
import getPartners from 'app/entities/partners/queries/getPartners'

export default function Partners() {
  return (
    <Container className="min-h-screen">
      <div className="px-2 py-8 md:p-8">
        <a id="partners" href="#partners" />

        <Typography variant="h3" color="textPrimary" gutterBottom>
          <b>LES PARTENAIRES DU BDE</b>
        </Typography>

        <Grid container>
          <Grid container item xs={12} md={6} alignItems="center">
            <Typography
              className="leading-9"
              variant="subtitle2"
              align="justify"
              color="textPrimary"
            >
              Le BDE dispose d'un membre responsable des partenariats, chargé de trouver et négocier
              des partenariats tout au long de l'année afin de proposer aux élèves toutes sortes
              d'avantages (réductions, offres promotionnelles, etc ...). <br />
              <br />
              Vous êtes intéressés pour entretenir un partenariat avec nous ? <br />
              Envoyez-nous un message via le{' '}
              <Link href="/#contact">
                <Button>
                  <strong>formulaire de contact</strong>
                </Button>
              </Link>
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Image
              src="/static/images/illustrations/Partners.svg"
              width={500}
              height={300}
              layout="responsive"
              alt="Illustration"
            />
          </Grid>
        </Grid>

        <Suspense fallback={<CircularProgress className="mx-auto" size={25} />}>
          <Carousel getQuery={getPartners} queryKey="partners" />
        </Suspense>
      </div>
    </Container>
  )
}
