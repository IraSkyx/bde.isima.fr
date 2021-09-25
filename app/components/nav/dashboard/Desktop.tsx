import Link from 'next/link'
import Tab from '@mui/material/Tab'
import List from '@mui/material/List'
import { useTheme } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Hidden from '@mui/material/Hidden'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import ListItem from '@mui/material/ListItem'
import TabContext from '@mui/lab/TabContext'
import { cloneElement, useMemo, useState } from 'react'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import { useBDEConfig } from './useBDEConfig'
import { useClubsConfig } from './useClubsConfig'
import { useCustomRouter } from 'app/entities/hooks/useCustomRouter'

export default function Desktop() {
  const bdeConfig = useBDEConfig()
  const clubsConfig = useClubsConfig()
  const { router } = useCustomRouter()
  const theme = useTheme()

  const [value, setValue] = useState(`${Number(clubsConfig.some((x) => x.to === router.asPath))}`)

  const handleChange = (_, newValue: string) => setValue(newValue)

  const Items = ({ config }) =>
    useMemo(
      () =>
        config.map((obj) => {
          const isActive = obj.isActive(router.asPath, window.location.hash)

          return (
            <Link key={obj.text} href={obj.to}>
              <Button
                className={`${isActive && 'bg-primary'} w-11/12 rounded-full my-1`}
                variant={isActive ? 'contained' : 'text'}
                size="small"
              >
                <ListItem dense disableGutters>
                  <ListItemIcon>
                    {cloneElement(obj.icon, {
                      className: `${isActive ? 'text-white' : undefined} rounded-full`,
                    })}
                  </ListItemIcon>

                  <ListItemText
                    secondary={obj.text}
                    secondaryTypographyProps={{
                      color: isActive ? 'secondary' : 'textPrimary',
                      noWrap: true,
                    }}
                  />
                </ListItem>
              </Button>
            </Link>
          )
        }),
      [config]
    )

  return (
    <Hidden mdDown>
      <Drawer open classes={{ paper: 'w-60 z-50 mt-16' }} variant="permanent">
        <TabContext value={value}>
          <AppBar position="static" color="inherit" elevation={0}>
            <TabList
              onChange={handleChange}
              textColor={theme.palette.mode === 'dark' ? 'secondary' : 'primary'}
              indicatorColor={theme.palette.mode === 'dark' ? 'secondary' : 'primary'}
              aria-label="Nav"
            >
              <Tab
                classes={{ root: 'min-w-1/2' }}
                label="BDE"
                value="0"
                disabled={!bdeConfig.length}
              />
              <Tab
                classes={{ root: 'min-w-1/2' }}
                label="Clubs"
                value="1"
                disabled={!clubsConfig.length}
              />
            </TabList>
          </AppBar>

          {bdeConfig.length > 0 && (
            <TabPanel value="0" className="pb-14">
              <List>
                <Items config={bdeConfig} />
              </List>
            </TabPanel>
          )}

          {clubsConfig.length > 0 && (
            <TabPanel value="1" className="pb-14">
              <List>
                <Items config={clubsConfig} />
              </List>
            </TabPanel>
          )}
        </TabContext>
      </Drawer>
    </Hidden>
  );
}
