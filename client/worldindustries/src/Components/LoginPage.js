import React, { useEffect } from 'react'
import {Grid,Paper,Avatar,FormControlLabel,Checkbox,Button,TextField} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./LoginPage.css"
import { toast } from 'react-toastify';






const Login = () => {


  const [username,setUsername]=useState("")
  const [password,setPassword]=useState("")
  const [email,setEmail]=useState("")
  const [newUser,setNewUser]=useState(false)
  const navigate=useNavigate()



// check if your cookie session exists on entry
useEffect(()=>{
  fetch("https://localhost:3001/cookietest",{credentials:"include"})
  .then(res=>res.json())
  .then(data=>{if(data.success==true){
      (navigate("/map"))
  }})
},[])



  const handleLogin = async (e) => {
    e.preventDefault();

    // are you a new user or are you signing in
    newUser===false ?  await fetch("https://localhost:3001/users/login",{
      credentials:"include",
      method:"POST",
      headers:{ 'Content-Type': 'application/json' },
      body: JSON.stringify({
      username:username,
      password:password
    })
  })
    .then(res=>res.json())
    .then(data => {
      if(data.userExists&&data.isVerified){
        navigate("/map")
    }
      else if(data.userExists){
        toast("Verify your email", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      }
      else{
        toast("User not found, create an account", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      }
    })
    : 
    fetch("https://localhost:3001/users",{
      method:"POST",
      headers:{ 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username:username,
        password:password,
        email:email,
        
      })
    })
    .then(res=>{
      res.json()
      })
    .then(()=> console.log("hi") )

    .catch(err => console.log(err))
  }


 // clicking on New user

const handleNewUser=()=>{
  setNewUser(true)
}


  const paperStyle={padding:50,height:'80vh',width:280,margin:"20px auto"}

  return (
    <>
    
    {newUser==false ?
    
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <Grid align="center">
          <Avatar>Pic</Avatar>
          <h1>Sign In</h1> 
        </Grid>
        <form id="form" onSubmit={handleLogin} style={{color:"black"}}>
          <TextField id="loginText" label='username' placeholder="Username" fullWidth required onChange={(e)=>{setUsername(e.target.value)}} sx={{color:'black !important'}}/>
          <TextField id="loginText" label='password' placeholder="Enter Password" type='password' fullWidth required onChange={(e)=>{setPassword(e.target.value)}} />
          {/* <FormControlLabel control={<Checkbox  />} label="Remember Me" />           */}
          <Button type='submit' color='primary' variant='contained' fullWidth onSubmit={handleLogin}>Sign In</Button> 
        </form>
        <Button type='NewAccount' color='primary' onClick={()=>handleNewUser()}> New User </Button>
        
      </Paper>

    </Grid>
    
    : 
    <Grid>
    <Paper elevation={10} style={paperStyle}>
      <Grid align="center">
        <Avatar>Pic</Avatar>
        <h1>Create New Account</h1> 
      </Grid>
      <form onSubmit={handleLogin}>
        <TextField label='username' placeholder="Username" fullWidth required onChange={(e)=>{setUsername(e.target.value)}}/>
        <TextField label='password' placeholder="Enter Password" type='password' fullWidth required onChange={(e)=>{setPassword(e.target.value)}} />
        <TextField label='email' placeholder="Enter Email" type='email' fullWidth required onChange={(e)=>{setEmail(e.target.value)}} />
        <FormControlLabel control={<Checkbox  />} label="Remember Me" />          
        <Button   type='submit' color='primary' variant='contained' fullWidth onSubmit={handleLogin}>Create</Button> 
      </form>
      
      
    </Paper>

  </Grid>
    }
    
    </>
  );
}


export default Login;