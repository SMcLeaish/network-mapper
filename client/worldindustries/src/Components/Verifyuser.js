import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"






const Verifyuser=()=>{

    const [searchParams,setSearchParams]=useSearchParams()
    const [user,setUser]=useState({});

    const eToken=searchParams.get("emailToken")
    

    useEffect(()=>{
        fetch("https://localhost:3001/users",{credentials:'include'})
        .then(res=>res.json())
        .then(data=>setUser(data.filter(user=>user.emailToken==eToken)))
    },[])
    console.log("user",user)
    return(
        <h1>Hi</h1>
    )
}

export default Verifyuser