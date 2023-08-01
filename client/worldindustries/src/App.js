import './App.css';
import React from 'react';
import { useState } from 'react';
import LoginPage from './Components/LoginPage';
import Map from './Components/Map/Map';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verifyuser from './Components/Verifyuser';
export const UserContext = React.createContext();
function App() {

  const [userInfo,setUserInfo]=useState({})


  return (
    <div className="App">
      <UserContext.Provider value={[userInfo,setUserInfo]}>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/map' element={<Map />}/>
        <Route path='/users/confirm/' element={<Verifyuser />}/>
      </Routes>
      </UserContext.Provider>
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