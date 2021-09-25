import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import Menu from '@mui/material/Menu'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { useMutation, useAuthenticatedSession } from 'blitz'

import Logout from 'mdi-material-ui/Logout'
import CogOutline from 'mdi-material-ui/CogOutline'
import MessageAlertOutline from 'mdi-material-ui/MessageAlertOutline'

import logout from 'app/entities/auth/mutations/logout'

export default function ModulesMenu() {
  const session = useAuthenticatedSession()
  const [anchorEl, setAnchorEl] = useState(null)
  const isOpen = Boolean(anchorEl)

  const [signOut] = useMutation(logout)

  const handleOpen = (event) => setAnchorEl(event.currentTarget)

  const handleClose = () => setAnchorEl(null)

  const onLogout = () => {
    signOut()
  }

  return (
    <div className="flex mx-2">
      {session?.image ? (
        <Image
          className="rounded-full"
          src={session.image}
          onClick={handleOpen}
          width={40}
          height={40}
          alt="Photo de profil"
        />
      ) : (
        <Avatar onClick={handleOpen} alt="Photo de profil" />
      )}

      <Menu
        id="avatar-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        MenuListProps={{ disablePadding: true }}
        PaperProps={{
          style: {
            maxHeight: 72 * 5,
            maxWidth: 200,
          },
        }}
        disableAutoFocusItem
      >
        <Typography className="pt-4 pl-4 pr-4" variant="subtitle1" noWrap>
          {session?.nickname || `${session?.firstname} ${session?.lastname}`}
        </Typography>

        <Divider className="m-3" />

        <Link href="/hub/settings">
          <MenuItem className="p-3" onClick={handleClose}>
            <CogOutline className="mx-3" />
            <Typography
              className="flex flex-grow items-center"
              variant="subtitle2"
              align="center"
              color="textPrimary"
            >
              Paramètres
            </Typography>
          </MenuItem>
        </Link>

        <Link href="/hub/feedback">
          <MenuItem className="p-3" onClick={handleClose}>
            <MessageAlertOutline className="mx-3" />
            <Typography
              className="flex flex-grow items-center"
              variant="subtitle2"
              align="center"
              color="textPrimary"
            >
              Feedback
            </Typography>
          </MenuItem>
        </Link>

        <MenuItem className="p-3" onClick={onLogout}>
          <Logout className="mx-3" />
          <Typography
            className="flex flex-grow items-center"
            variant="subtitle2"
            align="center"
            color="textPrimary"
          >
            Déconnexion
          </Typography>
        </MenuItem>
      </Menu>
    </div>
  )
}
