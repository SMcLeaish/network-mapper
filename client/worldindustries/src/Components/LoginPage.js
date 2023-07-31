import React, { useEffect } from 'react'
import {Grid,Paper,Avatar,FormControlLabel,Checkbox,Button,TextField} from '@mui/material'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import "./LoginPage.css"
import { toast } from 'react-toastify';
import PasswordStrengthBar from 'react-password-strength-bar';





const Login = () => {


  const [username,setUsername]=useState("")
  const [password,setPassword]=useState("")
  const [email,setEmail]=useState("")
  const [newUser,setNewUser]=useState(false)
  const navigate=useNavigate()
  const[userInfo,setUserInfo] =useState({})
  

// check if your cookie session exists on entry
useEffect(()=>{
    
    
    fetch("https://localhost:3001/cookietest",{credentials:"include"})
    .then(res=>res.json())
    .then(data=>{
      if(data.success==true){
         (navigate("/map",{state:data.data[0]}))
       
      }
      else{
        return
      }
})}
,[])

  




  const handleLogin = async (e) => {
    e.preventDefault();
    let sendUser={}
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
      console.log("data",data)
       if(data.userExists&&!data.isVerified){
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
      else if(!data.userExists){
        console.log("no user")
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
      else if(data.userExists&&data.isVerified){
        
         sendUser=data
      }
    }).then(async ()=>{
      fetch("https://localhost:3001/users/cookie",{
        credentials:"include",
        method:"PUT",
        headers:{ 'Content-Type': 'application/json' },
        body:JSON.stringify({
          username:username,
          password:password,
          
        })
      }).then(res=>res.json())
      .then( async data=>{
        if(data.success){
          
          navigate('/map',{state: sendUser})
        }
      })
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
        <PasswordStrengthBar password={password} minLength={5}/>
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