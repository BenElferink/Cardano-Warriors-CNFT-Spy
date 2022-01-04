import React, { Fragment } from 'react'
import Header from './Header'
import Charts from './Charts'
import Footer from './Footer'
import Loading from './Loading'

function Main({ warriorsData, floorData, isDesktop }) {
  return (
    <main className='main'>
      <Header />
      {warriorsData && floorData ? (
        <Fragment>
          <Charts warriorsData={warriorsData} floorData={floorData} isDesktop={isDesktop} />
          <Footer floorData={floorData} isDesktop={isDesktop} />
        </Fragment>
      ) : (
        <Loading />
      )}
    </main>
  )
}

export default Main
