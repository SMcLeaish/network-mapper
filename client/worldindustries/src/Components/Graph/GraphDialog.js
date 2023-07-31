import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Graph from './Graph'

function GraphDialog() {
  const [open, setOpen] = React.useState(true); // change this to false if you want the dialog to be initially closed

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={true}
      maxWidth={'lg'} 
      PaperProps={{
        style: {
          height: '100vh',
          overflowY: 'unset',
        },
      }}
    >
      {/* <DialogTitle>
        Your Dialog Title */}
        {/* <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
        >
          <CloseIcon /> */}
        {/* </IconButton> */}
      {/* </DialogTitle> */}
      <DialogContent dividers>
        <Graph />
      </DialogContent>
    </Dialog>
  );
}
export default GraphDialog 