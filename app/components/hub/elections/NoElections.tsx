import Typography from '@mui/material/Typography';

import Image from 'next/image';

export default function NoElections() {
  return (
    <div className="flex flex-col justify-center items-center">
      <Image
        src="/static/images/illustrations/NoData.svg"
        width={200}
        height={200}
        alt="Il n'y a pas d'élection BDE en cours"
      />

      <Typography variant="subtitle1" align="center" paragraph>
        Il n&apos;y a pas d&apos;élections BDE en cours
      </Typography>
    </div>
  );
}
