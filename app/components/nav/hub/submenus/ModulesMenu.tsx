import Link from 'next/link'
import { useState } from 'react'
import Menu from '@mui/material/Menu'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

import Apps from 'mdi-material-ui/Apps'
import Vote from 'mdi-material-ui/Vote'
import PuzzleOutline from 'mdi-material-ui/PuzzleOutline'

export default function ModulesMenu() {
  const [anchorEl, setAnchorEl] = useState(null)
  const isOpen = Boolean(anchorEl)

  const handleOpen = (event) => setAnchorEl(event.currentTarget)

  const handleClose = () => setAnchorEl(null)

  return <>
    <IconButton
      className="mx-2 text-primary dark:text-secondary"
      aria-label="Voir les modules"
      aria-owns={isOpen ? 'module-menu' : undefined}
      aria-haspopup="true"
      onClick={handleOpen}
      size="large">
      <Apps />
    </IconButton>

    <Menu
      id="module-menu"
      anchorEl={anchorEl}
      open={isOpen}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      MenuListProps={{ disablePadding: true }}
      PaperProps={{
        style: {
          maxHeight: 72 * 5,
          maxWidth: 300,
        },
      }}
      disableAutoFocusItem
    >
      <Typography className="pl-4 pt-4" variant="subtitle1">
        Modules
      </Typography>

      <Divider className="mx-3 mt-3" />

      <Link href="/hub/elections">
        <MenuItem className="p-3" onClick={handleClose}>
          <Vote className="mx-3" />
          <Typography
            className="flex flex-grow items-center justify-center"
            variant="subtitle2"
            align="center"
            color="textPrimary"
          >
            Élections BDE
          </Typography>
        </MenuItem>
      </Link>

      <Link href="/hub/feedback">
        <MenuItem className="p-3" onClick={handleClose}>
          <PuzzleOutline className="mx-3" />
          <Typography
            className="flex flex-grow items-center justify-center"
            variant="subtitle2"
            align="center"
            color="textPrimary"
          >
            Proposez vos extensions !
          </Typography>
        </MenuItem>
      </Link>
    </Menu>
  </>;
}
