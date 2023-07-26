import './App.css';
import LoginPage from './Components/LoginPage';
import Map from './Components/Map/Map';
import { Routes, Route } from 'react-router-dom';
import DetailsPage from './Components/DetailsPage/DetailsPage';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/map' element={<Map />}/>
        <Route path='/details' element={<DetailsPage />}/>

      </Routes>
    </div>
  );
}

export default App;