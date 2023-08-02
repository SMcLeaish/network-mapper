// import React, { useState, useContext } from 'react';
// import Button from '@mui/material/Button';
// import Popper from '@mui/material/Popper';
// import Paper from '@mui/material/Paper';
// import SettingsIcon from '@mui/icons-material/Settings';
// import { FormControl, InputLabel, MenuItem } from '@mui/material';
// import { layoutDefaults } from './CytoScapeDefaults';
// import { LayoutSettingsContext } from './GraphDialog';

// function SettingsPopup() {
//   const { layoutSettings, setLayoutSettings } = useContext(LayoutSettingsContext);
//   const [selectedLayoutName, setSelectedLayoutName] = useState(layoutSettings.name);
//   const selectedLayout = layoutDefaults[selectedLayoutName] || {};

//   const [anchorEl, setAnchorEl] = useState(null);

//   const handleClick = (event) => {
//     setAnchorEl(anchorEl ? null : event.currentTarget);
//   };

//   const handleSettingChange = (key, value) => {
//     setLayoutSettings({
//       ...layoutSettings,
//       [key]: { ...layoutSettings[key], value },
//     });
//   };

//   const open = Boolean(anchorEl);
//   const id = open ? 'simple-popper' : undefined;

//   return (
//     <div style={{ position: 'absolute', bottom: '10px', left: '10px'  }}>
//       <Button variant="contained" onClick={handleClick}>
//         <SettingsIcon />
//       </Button>
//       <Popper id={id} open={open} anchorEl={anchorEl} placement="left-start" style={{ zIndex: 5000 }}>
//         <Paper style={{ padding: '10px', borderRadius: '5px', zIndex: 5001, marginRight: '10px', width: '200px', height: '400px' }}>
//           {/* <h3>{selectedLayoutName.charAt(0).toUpperCase() + selectedLayoutName.slice(1)} Layout Settings</h3> */}
//           {Object.keys(selectedLayout).filter(key => key !== 'name').map(key => (
//             <div key={key}>
//               <label>{key}:</label>
//               {selectedLayout[key].render(layoutSettings[key]?.value, (value) => handleSettingChange(key, value))}
//             </div>
//           ))}
//         </Paper>
//       </Popper>
//     </div>
//   );
// }

// export default SettingsPopup;
