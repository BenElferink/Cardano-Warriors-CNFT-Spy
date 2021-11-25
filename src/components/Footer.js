import Portfolio from './Portfolio'
import Donate from './Donate'

function Footer({isDesktop}) {
  return (
    <footer className='flex-evenly'>
      <Portfolio isDesktop={isDesktop} />
      <Donate isDesktop={isDesktop} />
    </footer>
  )
}

export default Footer
