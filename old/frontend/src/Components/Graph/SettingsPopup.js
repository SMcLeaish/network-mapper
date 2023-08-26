import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import SettingsIcon from '@mui/icons-material/Settings';
import Slider from '@mui/material/Slider';
import { GraphContext } from './GraphDialog';

function SettingsPopup() {
  const {
    layoutSettings,
    setLayoutSettings,
  } = useContext(GraphContext);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(prevAnchorEl => prevAnchorEl ? null : event.currentTarget);
  };

  const handleSliderChange = (event, val) => {
    setLayoutSettings(prevSettings => ({
      ...prevSettings,
      nodeRepulsion: val,
    }));
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  return (
    <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
      <Button variant="contained" onClick={handleClick}>
        <SettingsIcon />
      </Button>
      <Popper id={id} open={open} anchorEl={anchorEl} placement="left-start" style={{ zIndex: 5000 }}>
        <Paper style={{ padding: '10px', borderRadius: '5px', zIndex: 5001, marginRight: '10px', width: '200px', height: 'auto' }}>
          {layoutSettings.name === 'fcose' && (
            <div>
              <label>Node Repulsion:</label>
              <Slider
                min={1000}
                max={100000}
                step={1000}
                value={layoutSettings.nodeRepulsion || 4500}
                onChange={handleSliderChange}
              />
              {layoutSettings.nodeRepulsion || 4500}
            </div>
          )}
        </Paper>
      </Popper>
    </div>
  );
}

export default SettingsPopup;
