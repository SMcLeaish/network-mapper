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
import EventPage from './Components/EventPage/EventPage';

const latte = '#F8F4E3';
const steelBlue = '#3F88C5';
const jet = '#2D2D2A';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label.Mui-focused': {
            color: latte,
          },
          '& .MuiFormLabel-root': {
            color: latte,
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: latte,
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: latte,
            },
            '&:hover fieldset': {
              borderColor: latte,
            },
            '&.Mui-focused fieldset': {
              borderColor: latte,
            },
            '& .MuiOutlinedInput-input': {
              color: latte
            },
            '& input:-webkit-autofill': {
              '-webkit-text-fill-color': latte,
              '-webkit-box-shadow': `0 0 0 100px ${jet} inset`,
            }
          },
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: steelBlue,
          color: latte,
          ':hover': {
            backgroundColor: '#5c9fd8'
          }
        },
        outlined: {
          color: steelBlue,
          border: `2px solid ${steelBlue}`,
          ':hover': {
            color: latte,
            backgroundColor: steelBlue,
            border: `2px solid ${steelBlue}`,
          }
        },
      }
    }
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
          <Route path='/event/:id' element={<EventPage />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;