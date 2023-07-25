import './App.css';
import LoginPage from './components/LoginPage';
import Map from './Components/Map/Map';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/login' element={<LoginPage />} />
      </Routes>
      <Map />
    </div>
  );
}

export default App;