import Container from '@mui/material/Container'

import Nav from 'app/components/nav/hub/Nav'

export default function getHubNav(Component) {
  return (
    <Container className="pt-24">
      <Nav />
      {Component}
    </Container>
  )
}
