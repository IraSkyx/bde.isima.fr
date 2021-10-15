import { Image } from 'blitz'
import { useSession } from 'blitz'
import Fab from '@mui/material/Fab'
import { cloneElement } from 'react'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'

import Login from '@mui/icons-material/LoginTwoTone'
import Account from '@mui/icons-material/AccountCircleTwoTone'

import config from './config'
import Link from 'app/core/lib/Link'
import { useRouter } from 'app/core/lib/router'
import logo from 'public/static/images/logos/logo.svg'

export default function Mobile({ isOpen, onOpen, onClose, onLoginRequested }) {
  const session = useSession()
  const { router, pushRoute } = useRouter()

  const iOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)

  const ItemsList = () => (
    <>
      {config.map((obj) => {
        const isActive = obj.isActive(router.asPath, window.location.hash)

        return (
          <Link key={obj.text} href={obj.to}>
            <Button
              className={`${isActive && 'bg-primary'} w-11/12 rounded-full my-1`}
              variant={isActive ? 'contained' : 'text'}
              size="small"
              onClick={onClose}
            >
              <ListItem dense disableGutters>
                <ListItemIcon>
                  {cloneElement(obj.icon, { className: isActive ? 'text-white' : undefined })}
                </ListItemIcon>

                <ListItemText
                  secondary={obj.text}
                  secondaryTypographyProps={{ color: isActive ? 'secondary' : 'textPrimary' }}
                />
              </ListItem>
            </Button>
          </Link>
        )
      })}
    </>
  )

  return (
    <SwipeableDrawer
      anchor="left"
      open={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      PaperProps={{ className: 'w-3/4' }}
    >
      <div className="text-center">
        <List>
          <ListItem>
            <ListItemIcon>
              <div className="m-2 mr-4">
                <Image
                  className="rounded-full"
                  src={logo}
                  width={40}
                  height={40}
                  alt="Logo BDE ISIMA"
                />
              </div>
            </ListItemIcon>

            <ListItemText primary="BDE ISIMA" />
          </ListItem>

          <ItemsList />

          <div className="m-3 flex justify-center">
            {session.userId ? (
              <Fab
                variant="extended"
                onClick={pushRoute('/hub')}
                aria-label="Mon compte"
                color="primary"
              >
                <Account className="mr-2" />
                MON COMPTE
              </Fab>
            ) : (
              <Fab
                variant="extended"
                onClick={onLoginRequested}
                aria-label="Se connecter"
                color="primary"
              >
                <Login className="mr-2" />
                SE CONNECTER
              </Fab>
            )}
          </div>
        </List>

        <ListItem>
          <ListItemText
            secondary={`Version ${globalThis.version}`}
            secondaryTypographyProps={{ align: 'center' }}
          />
        </ListItem>
      </div>
    </SwipeableDrawer>
  )
}
