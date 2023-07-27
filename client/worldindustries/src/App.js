import './App.css';
import LoginPage from './Components/LoginPage';
import Map from './Components/Map/Map';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verifyuser from './Components/Verifyuser';
function App() {



  return (
    <div className="App">
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/map' element={<Map />}/>
        <Route path='/users/confirm/' element={<Verifyuser />}/>
        
      </Routes>
      <ToastContainer
position="top-center"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss

pauseOnHover
theme="light"
/>
    </div>
  );
}

export default App;