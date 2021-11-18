import { Fragment, useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import { tooltipClasses } from '@mui/material/Tooltip'
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Tooltip,
  Typography,
} from '@mui/material'
import { Favorite as FavoriteIcon, Visibility as VisibilityIcon } from '@mui/icons-material'
import ADA_SYMBOL from '../constants/ADA_SYMBOL'
import crawlCNFT from '../functions/cnft'

function Listings({ title, options }) {
  const [data, setData] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      crawlCNFT(options)
        .then((warriors) => setData(warriors))
        .catch((error) => console.error(error))
    }, 1000 * 10)

    return () => {
      clearInterval(interval)
    }
  }, [options])

  return (
    <div className='listings-container'>
      <Typography variant='h4' component='div' sx={{ margin: '1rem 0' }}>
        {title}
      </Typography>
      <div className='list'>
        {data.length ? (
          data.map((listing) => <ListItem key={listing._id} listing={listing} />)
        ) : (
          <div style={{ width: '100%', display: 'grid', placeItems: 'center' }}>
            <CircularProgress color='secondary' />
          </div>
        )}
      </div>
    </div>
  )
}

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))

function ListItem({ listing }) {
  return (
    <Card sx={{ margin: '1rem 2rem', overflow: 'visible' }}>
      <HtmlTooltip
        followCursor
        title={
          <Fragment>
            <Typography variant='body2'>
              {listing.asset.metadata.type} - {listing.asset.metadata.rarity}
            </Typography>
            <br />
            {listing.asset.metadata.traits.map((trait) => (
              <Fragment key={`${listing._id}-${trait}`}>
                <Typography variant='body3'>{trait}</Typography>
                <br />
              </Fragment>
            ))}
            <br />
            {listing.asset.metadata.items.map((item) => (
              <Fragment key={`${listing._id}-${item.name}`}>
                <Typography variant='body3'>
                  {item.name} - {item.rarity}
                </Typography>
                <br />
              </Fragment>
            ))}
          </Fragment>
        }>
        <CardActionArea
          onClick={() => window.open(`https://cnft.io/token/${listing._id}`, '_blank')}>
          <CardMedia
            component='img'
            image={`https://ipfs.io/ipfs/${listing.asset.metadata.image.replace('ipfs://', '')}`}
            alt=''
          />
          <CardContent>
            <Typography gutterBottom variant='h5'>
              {ADA_SYMBOL}
              {listing.price / 1000000}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {listing.asset.metadata.name}
              <br />
              <span style={{ fontSize: '0.7rem' }}>
                Listed: {new Date(listing.createdAt).toLocaleString()}
              </span>
              <br />
              <br />
              <span className='icon-wrapper'>
                <span className='icon-item'>
                  <VisibilityIcon fontSize='small' /> {listing.views.length}
                </span>
                <span className='icon-item'>
                  <FavoriteIcon fontSize='small' /> {listing.favouriteCount}
                </span>
              </span>
            </Typography>
          </CardContent>
        </CardActionArea>
      </HtmlTooltip>
    </Card>
  )
}

export default Listings
