import './App.css';
import DetailsPage from './Components/DetailsPage/DetailsPage';
import LoginPage from './Components/LoginPage';
import Map from './Components/Map/Map';
// import GraphDialog from './Components/Graph/GraphDialog';
import { Routes, Route } from 'react-router-dom';
import AddEntity from './Components/AddEntity/AddEntity';
import { ThemeProvider, createTheme } from '@mui/material/styles';
//import Details from './Components/Details/Details';
import { useState } from 'react';
import { Dialog } from '@mui/material';

const chosenColor = '#F8F4E3';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label.Mui-focused': {
            color: chosenColor,
          },
          '& .MuiFormLabel-root': {
            color: chosenColor,
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: chosenColor,
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: chosenColor,
            },
            '&:hover fieldset': {
              borderColor: chosenColor,
            },
            '&.Mui-focused fieldset': {
              borderColor: chosenColor,
            },
            '& .MuiOutlinedInput-input': {
              color: chosenColor
            },
          },
        }
      }
    },
  }
});

function App() {

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/map' element={<Map />} />
          <Route path='details/:id' element={<DetailsPage />} />
          {/* <Route path='/graph' element={<GraphDialog />} /> */}
          <Route path='/add-entity' element={<AddEntity />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;