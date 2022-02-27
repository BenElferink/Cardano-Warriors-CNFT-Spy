import React from 'react'
import logo from '../assets/images/cw-logo.png'

function Header() {
  return (
    <header className='flex-col' style={{ margin: '1rem auto' }}>
      <img src={logo} alt='logo' />
      <h1
        style={{
          marginTop: '1rem',
          color: '#B20000',
          textShadow: '0 0 3px whitesmoke',
        }}
      >
        - Deprecated Application -
      </h1>
    </header>
  )
}

export default Header
