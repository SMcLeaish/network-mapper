import { Avatar, Button } from "@mui/material"
import { useEffect, useState } from "react"
import { Navigate, useNavigate, useSearchParams } from "react-router-dom"
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';







const Verifyuser=()=>{

    const [searchParams,setSearchParams]=useSearchParams()
    const navigate=useNavigate();

    const eToken=searchParams.get("emailToken")
    

    useEffect(()=>{
        let user={}
        fetch("https://localhost:3001/users/",{credentials:'include'})
        .then(res=>res.json())
        .then(  data=>  user=data.filter(user=>user.emailToken==eToken))
        .then( ()=> {console.log(user[0]);fetch(`https://localhost:3001/users/${user[0].id}`,{credentials:'include',
        headers:{'Content-Type': 'application/json'},
        method:"PUT",body:
        JSON.stringify(user[0])
    })})
        .then(()=>console.log(user[0].id))
    },[])

    return(
        <>
        <h1>Congrats, You've been verified. Return to Login</h1>
        <Button onClick={()=>navigate("/")}>Return</Button>
        <Avatar> <DoneOutlineIcon sx={{ color:"green",position:"center",  height: '150px', width: '150px' }}/> </Avatar>
        
        </>
    )
}

export default Verifyuser