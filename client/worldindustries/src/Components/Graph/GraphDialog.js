import React, { useState, useContext } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Graph from './Graph';
import SettingsPopup from './SettingsPopup';
import {layoutDefaults} from './CytoScapeDefaults';

export const LayoutSettingsContext = React.createContext();

function GraphDialog({ open, onClose, name }) {
  let [layoutSettings, setLayoutSettings] = useState(layoutDefaults.circle);
  const [detailsPageOpen, setDetailsPageOpen] = useState(false);
  const handleNodeTap = () => {
    onClose(); // Close the current dialog
    setDetailsPageOpen(true); // Open the DetailsPage dialog
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={'lg'} PaperProps={{ style: { height: '100vh', overflowY: 'unset' } }}>
      <DialogContent dividers>
        <LayoutSettingsContext.Provider value={[ layoutSettings, setLayoutSettings ]}>
          <Graph name={name} />
          <SettingsPopup />
        </LayoutSettingsContext.Provider>
      </DialogContent>
    </Dialog>
  );
}

export default GraphDialog;
