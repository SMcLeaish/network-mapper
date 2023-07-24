import React from 'react'
import {Grid,Paper,Avatar,FormControlLabel,Checkbox,Button,TextField,Link,Typography} from '@mui/material'

const Login = () => {

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('submitted');
  }

  const paperStyle={padding:50,height:'80vh',width:280,margin:"20px auto"}
  return (
    <>
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <Grid align="center">
          <Avatar>Pic</Avatar>
          <h1>Sign In</h1> 
        </Grid>
        <form onSubmit={handleLogin}>
          <TextField label='username' placeholder="Username" fullWidth required />
          <TextField label='password' placeholder="Enter Password" type='password' fullWidth required />
          <FormControlLabel control={<Checkbox  />} label="Remember Me" />          
          <Button type='submit' color='primary' variant='contained' fullWidth onSubmit={handleLogin}>Sign In</Button> 
        </form>
        <Button type='NewAccount' color='primary' > New User </Button>
        
      </Paper>

    </Grid>
   
    </>
  );
}


export default Login;