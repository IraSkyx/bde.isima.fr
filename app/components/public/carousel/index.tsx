import { useState } from 'react'
import { useQuery } from 'blitz'
import Card from '@mui/material/Card'
import Earth from 'mdi-material-ui/Earth'
import Twitter from 'mdi-material-ui/Twitter'
import Facebook from 'mdi-material-ui/Facebook'
import MultiCarousel from 'react-multi-carousel'
import Instagram from 'mdi-material-ui/Instagram'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import { useTheme, useMediaQuery } from '@mui/material'
import CardActionArea from '@mui/material/CardActionArea'

import CarouselDialog from './CarouselDialog'

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    paritialVisibilityGutter: 60,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
    paritialVisibilityGutter: 50,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
    paritialVisibilityGutter: 30,
  },
}

export default function Carousel({ getQuery, queryKey }) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const [isMoving, setIsMoving] = useState(false)
  const [selected, setSelected] = useState(null)

  const [data] = useQuery(getQuery, {}, { refetchOnWindowFocus: false })

  const stopPropagation = (e) => {
    e.stopPropagation()
  }

  const handleSelectionChange = (selected, open) => () => {
    if (!isMoving) {
      setSelected(selected)
    }
  }

  const handleChange = (value) => () => setIsMoving(value)

  return (
    <MultiCarousel
      additionalTransfrom={0}
      autoPlaySpeed={3000}
      minimumTouchDrag={80}
      containerClass="w-full mt-8"
      dotListClass=""
      focusOnSelect={false}
      infinite
      itemClass=""
      keyBoardControl
      responsive={responsive}
      showDots={false}
      sliderClass=""
      slidesToSlide={fullScreen ? 2 : 3}
      swipeable
      beforeChange={handleChange(true)}
      afterChange={handleChange(false)}
    >
      {data[queryKey].map((item) => (
        <Card key={item.id} className="mx-2 h-full">
          <CardActionArea
            className="flex flex-col h-full justify-start"
            onClick={handleSelectionChange(item, true)}
          >
            <div className="h-40 flex justify-center align-center">
              {item.image && (
                <img
                  className="object-contain max-h-full p-4"
                  src={item.image}
                  alt={`Logo ${item.name}`}
                />
              )}
            </div>

            <CardContent className="h-24">
              <Typography gutterBottom variant="subtitle1" component="h2">
                {item.name.toUpperCase()}
              </Typography>
            </CardContent>

            <CardActions className="flex flex-wrap justify-center" disableSpacing>
              {item.facebookURL && (
                <a
                  href={item.facebookURL}
                  onClick={stopPropagation}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Lien Facebook"
                >
                  <Facebook className="m-2 text-primary dark:text-secondary" />
                </a>
              )}
              {item.twitterURL && (
                <a
                  href={item.twitterURL}
                  onClick={stopPropagation}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Lien Twitter"
                >
                  <Twitter className="m-2 text-primary dark:text-secondary" />
                </a>
              )}
              {item.instagramURL && (
                <a
                  href={item.instagramURL}
                  onClick={stopPropagation}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Lien Instagram"
                >
                  <Instagram className="m-2 text-primary dark:text-secondary" />
                </a>
              )}
              {item.customURL && (
                <a
                  href={item.customURL}
                  onClick={stopPropagation}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Lien personnalisé"
                >
                  <Earth className="m-2 text-primary dark:text-secondary" />
                </a>
              )}
            </CardActions>
          </CardActionArea>
        </Card>
      ))}

      <CarouselDialog selected={selected} onClose={handleSelectionChange(null, false)} />
    </MultiCarousel>
  )
}
