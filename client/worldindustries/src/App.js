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

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {

  return (
    <ThemeProvider theme={darkTheme}>
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