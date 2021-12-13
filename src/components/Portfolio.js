import { useEffect, useState } from 'react'
import { Button, Drawer, IconButton, TextField, Typography, useMediaQuery } from '@mui/material'
import {
  Fingerprint,
  AddCircle,
  CloseRounded,
  ArrowCircleUp,
  ArrowCircleDown,
  CircleOutlined,
} from '@mui/icons-material'
import Chart from 'react-apexcharts'
import Modal from './Modal'
import Toggle from './Toggle'
import Loading from './Loading'
import ListItem from './ListItem'
import ChangeGreenRed from './ChangeGreenRed'
import { useLocalStorage } from '../hooks'
import {
  formatNumber,
  getAssetFromBlockfrost,
  getImageFromIPFS,
  getLineOptions,
  getPortfolioSeries,
} from '../functions'
import { ADA_SYMBOL, GREEN, POLICY_ID, RED } from '../constants'
import addImage from '../assets/images/add.png'
import styles from '../styles/Charts.module.css'

const OPACITY_WHITE = 'rgba(250, 250, 250, 0.4)'

function Portfolio({ floorData }) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [assets, setAssets] = useLocalStorage('assets', [])

  const [openModal, setOpenModal] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [showThirtyDay, setShowThirtyDay] = useState(false)

  const [adding, setAdding] = useState(false)
  const [addWarriorId, setAddWarriorId] = useState('')
  const [addWarriorIdError, setAddWarriorIdError] = useState(false)
  const [addWarriorPrice, setAddWarriorPrice] = useState('')
  const [addWarriorPriceError, setAddWarriorPriceError] = useState(false)

  const addAsset = async () => {
    setAdding(true)
    let idValid = false
    let priceValid = false
    const addWarriorIdTrimmed = Number(addWarriorId.replace('#', ''))

    if (addWarriorIdTrimmed >= 1 && addWarriorIdTrimmed <= 10000) idValid = true
    if (addWarriorPrice) priceValid = true

    if (!idValid || !priceValid) {
      setAddWarriorIdError(!idValid)
      setAddWarriorPriceError(!priceValid)
      setAdding(false)
      return
    }

    const assetData = await getAssetFromBlockfrost(addWarriorIdTrimmed)
    if (!assetData) {
      setAdding(false)
      return
    }

    const {
      onchain_metadata: { id, name, type, rarity, image },
    } = assetData

    const newDate = new Date()
    newDate.setHours(0)
    newDate.setMinutes(0)
    newDate.setSeconds(0)
    newDate.setMilliseconds(0)
    newDate.setDate(newDate.getDate() - 1)
    const timestamp = newDate.getTime()

    const payload = {
      id: Number(id),
      name,
      type: type.toLowerCase(),
      rarity: rarity.toLowerCase(),
      image: getImageFromIPFS(image),
      payed: Number(addWarriorPrice),
      timestamp,
    }

    setAssets((prev) => {
      if (prev.some((obj) => obj.id === payload.id)) {
        return prev.map((obj) => {
          if (obj.id === payload.id) {
            return { ...obj, payed: payload.payed }
          }

          return obj
        })
      }

      return [...prev, payload].sort((a, b) => a.id - b.id)
    })
    setAdding(false)
    setOpenDrawer(false)
  }

  const removeAsset = (id) => {
    setAssets((prev) => prev.filter((obj) => obj.id !== id))
  }

  const totalPayed = (() => {
    let totalPayed = 0
    assets.forEach(({ payed }) => {
      totalPayed += payed
    })
    return totalPayed
  })()

  const totalBalance = (() => {
    let totalBalance = 0
    assets.forEach(({ type }) => {
      totalBalance += floorData[type][floorData[type].length - 1].floor
    })
    return totalBalance
  })()

  const generateChartWidth = (width = window.innerWidth) => {
    const x = width - (width < 768 ? 50 : 420)
    return x > 1700 ? 1700 : x
  }
  const [chartWidth, setChartWidth] = useState(generateChartWidth())

  useEffect(() => {
    const handler = () => setChartWidth(generateChartWidth())
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, []) // eslint-disable-line

  const chartOptions = getLineOptions(floorData, showThirtyDay)
  const chartSeries = getPortfolioSeries(floorData, assets, showThirtyDay)

  return (
    <>
      <Button
        variant='contained'
        color='secondary'
        size={isMobile ? 'medium' : 'large'}
        startIcon={<Fingerprint />}
        onClick={() => setOpenModal(true)}>
        Portfolio
      </Button>

      <Modal title='Portfolio' open={openModal} onClose={() => setOpenModal(false)}>
        <div className='flex-row' style={{ width: '100%', padding: '1rem' }}>
          <div
            className='flex-col'
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: OPACITY_WHITE,
              borderRadius: '0.5rem',
            }}>
            <p style={{ marginBottom: '11px' }}>Total Payed</p>
            <div className='flex-row'>
              <span style={{ fontSize: '2rem' }}>
                {ADA_SYMBOL}
                {formatNumber(totalPayed)}
              </span>
            </div>
          </div>
          <div
            className='flex-col'
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: OPACITY_WHITE,
              borderRadius: '0.5rem',
            }}>
            <p style={{ marginBottom: '11px' }}>Current Balance</p>
            <div className='flex-row'>
              <span style={{ fontSize: '2rem' }}>
                {ADA_SYMBOL}
                {formatNumber(totalBalance)}
              </span>
              <div className='flex-col' style={{ marginLeft: '0.5rem' }}>
                <ChangeGreenRed
                  value={((100 / totalBalance) * (totalBalance - totalPayed)).toFixed(0)}
                  suffix='%'
                  invert
                  withCaret
                />
                <ChangeGreenRed
                  value={formatNumber(totalBalance - totalPayed)}
                  prefix={ADA_SYMBOL}
                  invert
                  withCaret
                />
              </div>
            </div>
          </div>
        </div>

        <section className={styles.chartContainer}>
          <div className='flex-row' style={{ width: '100%', justifyContent: 'space-evenly' }}>
            <Toggle
              name='chart-days'
              labelLeft='7d'
              labelRight='30d'
              state={{
                value: showThirtyDay,
                setValue: setShowThirtyDay,
              }}
            />
            <div style={{ width: '42%' }} />
          </div>
          <Chart
            width={chartWidth}
            type='area'
            options={{
              ...chartOptions,
              colors: [
                'var(--blue)',
                chartSeries[1].data[0] < chartSeries[1].data[chartSeries[1].data.length - 1] ? GREEN : RED,
              ],
            }}
            series={chartSeries}
          />
        </section>

        <div style={{ overflow: 'unset' }}>
          <div
            style={{
              width: '90%',
              height: '2px',
              margin: '2rem auto 1rem auto',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '11px',
            }}
          />
          <Typography variant='h6' sx={{ textAlign: 'center' }}>
            My Assets
          </Typography>
          <div
            style={{
              width: isMobile ? 'calc(100vw - 2rem)' : `${generateChartWidth(window.innerWidth) + 100}px`,
              height: 'fit-content',
              display: 'flex',
              flexFlow: 'row wrap',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            {adding ? (
              <Loading />
            ) : (
              <ListItem
                htmlToolTipContent={<div>add new asset</div>}
                style={{ margin: '1rem', backgroundColor: OPACITY_WHITE }}
                flipToSide={isMobile}
                price='DD NEW'
                name='Click to add new asset'
                imageSrc={addImage}
                imageStyle={{ padding: '1rem' }}
                onClick={() => setOpenDrawer((prev) => !prev)}
                iconArray={[
                  {
                    icon: AddCircle,
                    txt: '',
                  },
                ]}
              />
            )}
            {assets.map(({ id, name, type, rarity, image, payed }) => {
              const priceDiff = floorData[type][floorData[type].length - 1].floor - payed

              return (
                <div key={id} style={{ position: 'relative' }}>
                  <IconButton
                    onClick={() => removeAsset(id)}
                    sx={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: '1' }}>
                    <CloseRounded />
                  </IconButton>
                  <ListItem
                    htmlToolTipContent={
                      <div>
                        {type} - {rarity}
                      </div>
                    }
                    style={{ margin: '1rem', backgroundColor: OPACITY_WHITE }}
                    flipToSide={isMobile}
                    name={name}
                    price={formatNumber(payed)}
                    imageSrc={image}
                    itemUrl={`https://pool.pm/${POLICY_ID}.CardanoWarrior${id}`}
                    iconArray={[
                      {
                        icon:
                          priceDiff > 0 ? ArrowCircleUp : priceDiff < 0 ? ArrowCircleDown : CircleOutlined,
                        txt: formatNumber(priceDiff),
                      },
                    ]}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </Modal>

      <Drawer
        anchor='bottom'
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        sx={{ zIndex: '999999' }}>
        <div
          className='flex-col'
          style={{
            maxWidth: '550px',
            width: '100%',
            margin: '1rem auto',
            padding: '0.5rem 1rem',
            alignItems: 'unset',
          }}>
          <TextField
            label='Warrior ID'
            placeholder='#2682'
            varient='outlined'
            value={addWarriorId}
            onChange={(e) => {
              setAddWarriorId(e.target.value)
              setAddWarriorIdError(false)
            }}
            error={addWarriorIdError}
            sx={{ margin: '0.4rem 0' }}
          />
          <TextField
            label='ADA Payed'
            placeholder={`${ADA_SYMBOL}600`}
            varient='outlined'
            value={addWarriorPrice}
            onChange={(e) => {
              setAddWarriorPrice(e.target.value)
              setAddWarriorPriceError(false)
            }}
            error={addWarriorPriceError}
            sx={{ margin: '0.4rem 0' }}
          />

          {adding ? (
            <Loading />
          ) : (
            <Button
              variant='contained'
              color='secondary'
              size='large'
              startIcon={<AddCircle />}
              onClick={addAsset}
              sx={{ margin: '0.4rem 0' }}>
              Add
            </Button>
          )}
        </div>
      </Drawer>
    </>
  )
}

export default Portfolio
