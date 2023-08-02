import React, { useState, useContext } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Graph from './Graph';
import SettingsPopup from './SettingsPopup';
import {layoutDefaults} from './CytoScapeDefaults';

export const LayoutSettingsContext = React.createContext();
function GraphDialog({ open, onClose }) {
  let [layoutSettings, setLayoutSettings] = useState(layoutDefaults.circle);
  
  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={'lg'} PaperProps={{ style: { height: '100vh', overflowY: 'unset' } }}>
      <DialogContent dividers>
        <LayoutSettingsContext.Provider value={{ layoutSettings, setLayoutSettings }}>
          <Graph />
          <SettingsPopup />
        </LayoutSettingsContext.Provider>
      </DialogContent>
    </Dialog>
  );
}

export default GraphDialog;
