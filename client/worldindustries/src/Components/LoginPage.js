import React, { useContext, useEffect } from 'react'
import { Container, Box, Typography, Grid, Paper, Avatar, FormControlLabel, Checkbox, Button, TextField } from '@mui/material'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import "./LoginPage.css"
import { toast } from 'react-toastify';
import PasswordStrengthBar from 'react-password-strength-bar';
import { UserContext } from '../App'





const Login = () => {

  const [userInfo, setUserInfo] = useContext(UserContext)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [newUser, setNewUser] = useState(false)
  const [user_organization, setuser_organization] = useState("")


  const navigate = useNavigate()




  // check if your cookie session exists on entry
  useEffect(() => {


    fetch("https://localhost:3001/cookietest", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.success == true && data.data[0]) {
          console.log(data.data[0])
          setUserInfo(data.data[0])
          navigate("/map", { state: data.data[0] })

        }
        else {
          return
        }
      })
  }
    , [])






  const handleLogin = async (e) => {
    e.preventDefault();
    let sendUser = {}
    console.log("submitting", newUser)
    // are you a new user or are you signing in
    newUser === false ? await fetch("https://localhost:3001/users/login", {
      credentials: "include",
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log("data");
        if (data.userExists && data.isVerified==false) {
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
        else if (data.userExists && data.isVerified) {
          sendUser = data
        }
        else {
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
          return
        }
      }).then(async () => {
        fetch("https://localhost:3001/users/cookie", {
          credentials: "include",
          method: "PUT",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username,
            password: password,

          })
        }).then(res => res.json())
          .then(async data => {
            if (data.success) {
              setUserInfo(sendUser)
              navigate('/map', { state: sendUser })
            }
          })
      })
      :
      fetch("https://localhost:3001/users", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: password,
          email: email,
          user_organization: user_organization

        })
      })
        .then(res => {
          res.json()
        })
        .then(() => console.log("hi"))

        .catch(err => console.log(err))
  }


  // clicking on New user

  const handleNewUser = () => {
    setNewUser(true)
  }

  const handleSignIn = () => {
    setNewUser(false);
  }

  return (
    <>

      {newUser == false ?


        <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        className='bg-jet'
        >
          <Paper elevation={24} sx={{ borderRadius: '20px' }}>
            <Grid container maxWidth='md'>
              <Grid container item xs={6} className='login-grid login-grid-left' justifyContent='center'>
                <Grid item xs={8}>
                  <Typography variant="h6" gutterBottom textAlign={'center'}>
                    <img src='/nm-logo-horizontal.png' alt='network mapper' className='mock-image' />
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="h5" gutterBottom textAlign={'center'}>
                    Sign In
                  </Typography>
                </Grid>
                <Grid container item xs={8} justifyContent='center'>
                  <form id="form" onSubmit={handleLogin} style={{ backgroundColorcolor: "black" }}>
                    <TextField id="loginText" label='username' placeholder="Username" margin='dense' fullWidth required onChange={(e) => { setUsername(e.target.value) }} sx={{ color: 'red' }} />
                    <TextField id="loginText" label='password' placeholder="Enter Password" type='password' className='extra-margin' margin='dense' fullWidth required onChange={(e) => { setPassword(e.target.value) }} />
                    <Button type='submit' color='primary' variant='contained' fullWidth onSubmit={handleLogin}>Sign In</Button>
                  </form>
                  <Button type='NewAccount' color='primary' onClick={() => handleNewUser()}> New User </Button>
                </Grid>
              </Grid>
              <Grid item xs={6} className='login-grid login-grid-right'>
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom textAlign={'center'}>
                    Welcome to Network Mapper
                  </Typography>
                  <Typography variant="body1" gutterBottom textAlign={'center'}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    do eiusmod tempor incididunt ut labore et dolore.
                  </Typography>
                </Grid>
                <Container className='mock-container'>
                  <img src='/nm-mock.png' alt='network mapper' className='mock-image' />
                </Container>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        :

        <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        className='bg-jet'
        >
          <Paper elevation={24} sx={{ borderRadius: '20px' }}>
            <Grid container maxWidth='md'>
              <Grid container item xs={6} className='login-grid login-grid-left' justifyContent='center'>
                <Grid item xs={8}>
                  <Typography variant="h6" gutterBottom textAlign={'center'}>
                    <img src='/nm-logo-horizontal.png' alt='network mapper' className='mock-image' />
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="h5" gutterBottom textAlign={'center'}>
                    Create New Account
                  </Typography>
                </Grid>
                <Grid container item xs={8} justifyContent='center'>
                  <form onSubmit={handleLogin}>
                    <TextField label='Username' placeholder="Username" type='text' margin='dense' fullWidth required onChange={(e) => { setUsername(e.target.value) }} />
                    <TextField label='Password' placeholder="Enter Password" type='password' margin='dense' fullWidth required onChange={(e) => { setPassword(e.target.value) }} />
                    <PasswordStrengthBar password={password} minLength={5} />
                    <TextField label='User Org' placeholder="Enter Organization" type='text' margin='dense' fullWidth required onChange={(e) => { setuser_organization(e.target.value) }} />
                    <TextField label='email' placeholder="Enter Email" type='email' margin='dense' className='extra-margin' fullWidth required onChange={(e) => { setEmail(e.target.value) }} />
                    <Button type='submit' color='primary' variant='contained' fullWidth onSubmit={handleLogin}>Create Account</Button>
                  </form>
                  <Button type='SignIn' color='primary' onClick={() => handleSignIn()}> Already Have An Account </Button>
                </Grid>
              </Grid>
              <Grid item xs={6} className='login-grid login-grid-right'>
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom textAlign={'center'}>
                    Welcome to Network Mapper
                  </Typography>
                  <Typography variant="body1" gutterBottom textAlign={'center'}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    do eiusmod tempor incididunt ut labore et dolore.
                  </Typography>
                </Grid>
                <Container className='mock-container'>
                  <img src='/nm-mock.png' alt='network mapper' className='mock-image' />
                </Container>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      }

    </>
  );
}


export default Login;