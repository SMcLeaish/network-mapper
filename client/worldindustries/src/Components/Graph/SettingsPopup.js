import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import SettingsIcon from '@mui/icons-material/Settings';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { circle, fcose } from './CytoScapeDefaults';

const availableLayouts = [circle, fcose];

function SettingsPopup() {
  const [selectedLayout, setSelectedLayout] = useState(circle);
  const [layoutSettings, setLayoutSettings] = useState({ ...circle });
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleSettingChange = (key, value) => {
    setLayoutSettings({
      ...layoutSettings,
      [key]: { ...layoutSettings[key], value },
    });
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  return (
    <div style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 1 }}>
      <Button variant="contained" onClick={handleClick}>
        <SettingsIcon />
      </Button>
      <Popper id={id} open={open} anchorEl={anchorEl} placement="left-start" style={{ zIndex: 5000 }}>
        <Paper style={{ padding: '10px', borderRadius: '5px', zIndex: 5000, marginRight: '10px', width: '200px', height: '400px' }}>
          <Select
            value={selectedLayout.name}
            onChange={(e) => {
              const layout = availableLayouts.find(l => l.name === e.target.value);
              setSelectedLayout(layout);
              setLayoutSettings({ ...layout });
            }}
          >
            {availableLayouts.map(layout => (
              <MenuItem key={layout.name} value={layout.name}>{layout.name.charAt(0).toUpperCase() + layout.name.slice(1)}</MenuItem>
            ))}
          </Select>
          {Object.keys(selectedLayout).filter(key => key !== 'name').map(key => (
            <div key={key}>
              <label>{key}:</label>
              {selectedLayout[key].render(layoutSettings[key].value, (value) => handleSettingChange(key, value))}
            </div>
          ))}
        </Paper>
      </Popper>
    </div>
  );
}

export default SettingsPopup;
