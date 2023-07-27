import React from 'react'
import {Grid,Paper,Avatar,FormControlLabel,Checkbox,Button,TextField,Link,Typography} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from "react-cookie"
import "./LoginPage.css"
import { ToastContainer, toast } from 'react-toastify';






const Login = () => {
  const [username,setUsername]=useState("")
  const [password,setPassword]=useState("")
  const [email,setEmail]=useState("")
  const [newUser,setNewUser]=useState(false)
  const [cookie, setCookie] = useState(false)

  const navigate=useNavigate()

  const handleLogin = async (e) => {

    e.preventDefault();
     fetch("https://localhost:3001/cookietest",{credentials:"include"})
    .then(res=>res.json())
    .then(data=>{if(data.success==true){
        // navigate('/map')
    }})
    
    
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
      console.log(data.isVerified)
      
      if(data.userExists && data.isVerified==false){
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
      console.log("res",res)
      res.json()
      })
    .then(()=> console.log("hi") )

    .catch(err => console.log(err))
    
    
 
 
    
    // fetch and set body to the parameters
  }
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