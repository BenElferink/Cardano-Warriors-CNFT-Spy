import { useState } from 'react'
import { Button, Chip, IconButton, Modal, Typography, useMediaQuery } from '@mui/material'
import { CreditCard, CloseRounded, ContentCopy } from '@mui/icons-material'
import qrCode from '../assets/images/YoroiQR.png'
import { ADA_ADDRESS } from '../constants'

function Donate() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [open, setOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const copyAddress = () => {
    if (!isCopied) {
      navigator.clipboard.writeText(ADA_ADDRESS)
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 1000)
    }
  }

  return (
    <>
      <Button
        variant='contained'
        color='secondary'
        size={isMobile ? 'medium' : 'large'}
        startIcon={<CreditCard />}
        onClick={() => setOpen(true)}>
        Donate
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
          <Typography variant='h5'>Donate (ADA address)</Typography>

          <div
            style={{
              width: 'fit-content',
              height: 'fit-content',
              margin: '2rem 0',
              padding: '11px',
              borderRadius: '11px',
              backgroundColor: 'whitesmoke',
            }}>
            <img src={qrCode} alt='' />
          </div>

          <Chip
            sx={{
              width: '200px',
              backgroundColor: 'whitesmoke',
              alignItems: 'center',
              justifyContent: 'space-between',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              '&:hover': {
                backgroundColor: 'whitesmoke',
              },
            }}
            label={isCopied ? 'Copied 👍' : ADA_ADDRESS}
            onClick={copyAddress}
            onDelete={copyAddress}
            deleteIcon={<ContentCopy />}
          />
        </div>
      </Modal>
    </>
  )
}

export default Donate
