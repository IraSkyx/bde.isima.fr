import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { isSameDay } from 'date-fns';

import CalendarChip from 'app/components/hub/events/CalendarChip';

type CalendarCellProps = {
  idx: number;
  date: Date;
  events?: any[];
  fallback?: boolean;
};

export default function CalendarCell({ idx, date, events = [], fallback = false }: CalendarCellProps) {
  return (
    <Grid
      className={`p-2
                  min-h-100
                  border-t
                  border-l
                  ${(idx % 2 == 1 || idx == 6) && 'border-r'}
                  ${idx == 6 && 'border-b'}
                  ${(idx == 1 || idx == 5) && 'md:border-r-0'}
                  ${(idx == 4 || idx == 5) && 'md:border-b'}
                  border-0
                  border-solid`}
      item
      container
      xs={idx === 6 ? 12 : 6}
      md={idx < 4 ? 3 : 4}
      sx={{
        borderColor: 'divider'
      }}
      justifyContent="center"
      alignContent="flex-start"
    >
      <Grid item container xs={12} justifyContent="center">
        <Typography variant="subtitle1" align="center" gutterBottom>
          {`${date.toLocaleString('fr-FR', { weekday: 'short' }).toUpperCase()} ${date
            .getDate()
            .toString()
            .padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`}
        </Typography>
      </Grid>

      {fallback ? (
        <Skeleton height="40" width="60%" />
      ) : (
        events.map(
          (event: any, eventIdx) =>
            isSameDay(date, event.takes_place_at) && <CalendarChip key={eventIdx} event={event} />
        )
      )}
    </Grid>
  );
}
