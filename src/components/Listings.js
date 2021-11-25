import { Fragment, useEffect, useRef, useState } from 'react'
import { Card, CardActionArea, CardContent, CardMedia, Typography, useMediaQuery } from '@mui/material'
import { Favorite as FavoriteIcon, Visibility as VisibilityIcon } from '@mui/icons-material'
import Loading from './Loading'
import HtmlTooltip from './HtmlTooltip'
import { ADA_SYMBOL } from '../constants'
import crawlCNFT from '../functions/crawlCNFT'
import styles from '../styles/Listings.module.css'

function Listings({ title = 'Listings', options = {} }) {
  const [data, setData] = useState([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const pageRef = useRef(1)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  console.log(data)

  useEffect(() => {
    // keep looking for new data every 10 seconds
    const interval = setInterval(() => {
      crawlCNFT(options)
        .then((warriors) => {
          setData((prev) => {
            // if there is no pre-fetched data, just return the current fetched data
            if (!prev.length) return warriors
            // a verification method to add only new data to the front of the array
            const newWarriors = []
            for (const currentWarrior of warriors) {
              if (currentWarrior._id === prev[0]._id) break
              newWarriors.push(currentWarrior)
            }
            return [...newWarriors, ...prev]
          })
        })
        .catch((error) => {
          console.error(error)
        })
    }, 1000 * 10)

    return () => {
      clearInterval(interval)
    }
  }, [options])

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight, scrollLeft, clientWidth, scrollWidth } = e.target
    const isScrolledToBottom = scrollTop === scrollHeight - clientHeight
    const isScrolledToRight = scrollLeft === scrollWidth - clientWidth

    // fetch next page of data when scrolled to bottom
    if (!isLoadingMore && ((isDesktop && isScrolledToBottom) || (!isDesktop && isScrolledToRight))) {
      pageRef.current += 1
      setIsLoadingMore(true)
      crawlCNFT({ ...options, page: pageRef.current })
        .then((warriors) => {
          setData((prev) => {
            // a verification method to add only new data to the end of the array
            const newWarriors = []
            for (let i = warriors.length - 1; i >= 0; i--) {
              const currentWarrior = warriors[i]
              if (currentWarrior._id === prev[prev.length - 1]._id) break
              newWarriors.unshift(currentWarrior)
            }
            return [...prev, ...newWarriors]
          })
          setIsLoadingMore(false)
        })
        .catch((error) => {
          console.error(error)
          setIsLoadingMore(false)
        })
    }
  }

  return (
    <div className={styles.listingsContainer}>
      <Typography
        variant='h4'
        component='div'
        sx={{
          margin: '1rem 0',
          fontFamily: 'IndieFlower',
          fontWeight: 'bold',
          color: 'whitesmoke',
          textShadow: '-1px 1px 3px black',
        }}>
        {title}
      </Typography>

      <div className={styles.list} onScroll={handleScroll}>
        {data.length ? (
          data.map((listing) => <ListItem key={listing._id} listing={listing} isSold={options.sold} />)
        ) : (
          <Loading />
        )}
        {isLoadingMore && <Loading />}
      </div>
    </div>
  )
}

function ListItem({ listing, isSold }) {
  const clickItem = () =>
    isSold
      ? window.open(`https://pool.pm/${listing.asset.unit}`, '_blank')
      : window.open(`https://cnft.io/token/${listing._id}`, '_blank')

  return (
    <Card sx={{ margin: '1rem 2rem', borderRadius: '1rem', overflow: 'visible' }}>
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
        <CardActionArea onClick={clickItem}>
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
              <span className={styles.iconsWrapper}>
                <span className={styles.iconItem}>
                  <VisibilityIcon fontSize='small' /> {listing.views.length}
                </span>
                <span className={styles.iconItem}>
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
