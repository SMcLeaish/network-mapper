import './App.css';
//import DetailsPage from './Components/DetailsPage/DetailsPage';
import LoginPage from './Components/LoginPage';
import Map from './Components/Map/Map';
import GraphDialog from './Components/Graph/GraphDialog';
import { Routes, Route } from 'react-router-dom';
//import Details from './Components/Details/Details';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/map' element={<Map />}/>
        <Route path='/graph' element={<GraphDialog />} />
      </Routes>
    </div>
  );
}

export default App;
