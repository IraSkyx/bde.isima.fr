import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'

import Discord from 'mdi-material-ui/Discord'

export default function DiscordButton() {
  return (
    <CardActionArea
      href="https://discord.gg/fMmaSKavkv"
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: 'inherit' }}
    >
      <Card
        className="flex justify-center rounded-b-md mb-4 p-2"
        style={{ backgroundColor: '#7289DA' }}
        square
      >
        <Discord className="text-white" />
      </Card>
    </CardActionArea>
  )
}
