import { Suspense } from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Club } from 'db';

import Image from 'next/image';

import getPublicClubs from 'app/entities/clubs/queries/getPublicClubs';

import Carousel from './carousel';

export default function Clubs() {
  return (
    <Box>
      <Container className="px-2 py-8 md:p-8">
        <a id="clubs" href="#clubs" />
        <Typography variant="h3" align="right" gutterBottom>
          <b>LES CLUBS DU BDE</b>
        </Typography>

        <Grid container>
          <Grid item xs={12} md={6}>
            <Image
              src="/static/images/illustrations/Clubs.svg"
              width={500}
              height={300}
              layout="responsive"
              alt="Illustration"
              quality={100}
            />
          </Grid>

          <Grid container item xs={12} md={6} alignItems="center">
            <Typography className="leading-9" variant="subtitle2" align="justify">
              Le BDE se décompose en une multitude de clubs avec chacun une activité propre. Il y en a pour tous les
              goûts (activités associatives scientifiques, techniques, technologiques, culturelles ou encore sportives)
              et c&apos;est souvent Isibouffe qui régale ! <br />
              La vie associative est un aspect très important du BDE, quelles que soient tes passions tu trouveras
              forcément un club qui te plaira !
            </Typography>
          </Grid>
        </Grid>
      </Container>
      <Suspense fallback={<CircularProgress className="mx-auto" size={25} />}>
        <Carousel<Club> getQuery={getPublicClubs} queryKey="clubs" />
      </Suspense>
    </Box>
  );
}
