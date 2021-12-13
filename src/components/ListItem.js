import React, { Fragment } from 'react'
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material'
import HtmlToolTip from './HtmlTooltip'
import { ADA_SYMBOL } from '../constants'
import styles from '../styles/Listings.module.css'

function ListItem({
  style = {},
  name,
  price,
  imageSrc,
  imageStyle = {},
  itemUrl = 'https://pool.pm',
  onClick,
  htmlToolTipContent: HtmlToolTipContent = <div />,
  spanArray,
  iconArray,
  iconSize = 'small',
  flipToSide = false,
}) {
  return (
    <Card sx={{ margin: '1rem 2rem', borderRadius: '1rem', overflow: 'visible', ...style }}>
      <HtmlToolTip followCursor title={HtmlToolTipContent}>
        <CardActionArea
          style={{ display: 'flex', flexDirection: flipToSide ? 'row-reverse' : 'column' }}
          onClick={() => (onClick ? onClick() : window.open(itemUrl, '_blank'))}>
          <CardMedia
            component='img'
            image={imageSrc}
            alt=''
            sx={{
              width: '200px',
              height: '200px',
              borderRadius: flipToSide ? '0 1rem 1rem 0' : '1rem 1rem 0 0',
              ...imageStyle,
            }}
          />
          <CardContent>
            <Typography gutterBottom variant='h5'>
              {ADA_SYMBOL + price}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {name}
              <br />
              {spanArray &&
                spanArray.map((txt) => (
                  <Fragment key={txt}>
                    <span style={{ fontSize: '0.7rem' }}>{txt}</span>
                    <br />
                  </Fragment>
                ))}
              <br />
              {iconArray && (
                <span className={styles.iconsWrapper}>
                  {iconArray.map(({ icon: Icon, txt }, i) => (
                    <span className={styles.iconItem} key={`${i}-${txt}`}>
                      <Icon fontSize={iconSize} />
                      &nbsp;{txt}
                    </span>
                  ))}
                </span>
              )}
            </Typography>
          </CardContent>
        </CardActionArea>
      </HtmlToolTip>
    </Card>
  )
}

export default ListItem
