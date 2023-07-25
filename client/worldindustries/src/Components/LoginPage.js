import React from 'react'
import {Grid,Paper,Avatar,FormControlLabel,Checkbox,Button,TextField,Link,Typography} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from "react-cookie"

const Login = () => {
  const [username,setUsername]=useState("")
  const [password,setPassword]=useState("")
  const [email,setEmail]=useState("")
  const [newUser,setNewUser]=useState(false)
  const [cookie, setCookie] = useCookies(["user"])

  const navigate=useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("newUser",newUser," email",email," password",password," username",username)
    
    newUser===false ?  fetch("https://localhost:3001/users/login",{
      method:"POST",
      headers:{ 'Content-Type': 'application/json' },
      body: JSON.stringify({
      username:username,
      password:password
    })
  })
    .then(res=>res.json())
    .then(data => {
      if(data.userExists){
        navigate("/map")
      }
      // if data.userExists is true, user is valid and logged in
      // else data.userExists is false, and user is not valid
      //navigtae("page")
    })
    : 
    fetch("https://localhost:3001/users",{
      method:"POST",
      headers:{ 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username:username,
        password:password,
        email:email
      })
    })
    .then(res=>{
      console.log(res)
      res.json()
      })
    .then(data => console.log(data))

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
        <form onSubmit={handleLogin}>
          <TextField label='username' placeholder="Username" fullWidth required onChange={(e)=>{setUsername(e.target.value)}}/>
          <TextField label='password' placeholder="Enter Password" type='password' fullWidth required onChange={(e)=>{setPassword(e.target.value)}} />
          <FormControlLabel control={<Checkbox  />} label="Remember Me" />          
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
        <Button type='submit' color='primary' variant='contained' fullWidth onSubmit={handleLogin}>Create</Button> 
      </form>
      
      
    </Paper>

  </Grid>
    }
    </>
  );
}


export default Login;