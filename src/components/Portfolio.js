import { useState } from 'react'
import { Button, IconButton, Modal, Typography, useMediaQuery } from '@mui/material'
import { Fingerprint, CloseRounded } from '@mui/icons-material'

function Portfolio() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant='contained'
        color='secondary'
        size={isMobile ? 'medium' : 'large'}
        startIcon={<Fingerprint />}
        onClick={() => setOpen(true)}>
        Portfolio
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div
          style={{
            maxWidth: isMobile ? '100vw' : '420px',
            width: '100%',
            padding: '1rem',
            height: isMobile ? '100vh' : 'fit-content',
            backgroundColor: 'var(--blue)',
            borderRadius: isMobile ? '0' : '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}>
          <IconButton
            sx={{
              margin: '7px',
              position: 'absolute',
              top: '0',
              right: '0',
            }}
            onClick={() => setOpen(false)}>
            <CloseRounded color='error' />
          </IconButton>
          <Typography variant='h5'>Coming Soon™️</Typography>
        </div>
      </Modal>
    </>
  )
}

export default Portfolio
