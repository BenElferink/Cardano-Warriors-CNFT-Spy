import React from 'react'
import logo from '../assets/images/cw-logo.png'

function Header() {
  return (
    <header className='flex-evenly'>
      <img src={logo} alt='logo' />
    </header>
  )
}

export default Header
