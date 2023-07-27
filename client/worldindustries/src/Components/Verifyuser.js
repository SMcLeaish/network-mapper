import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"






const Verifyuser=()=>{

    const [searchParams,setSearchParams]=useSearchParams()
    

    const eToken=searchParams.get("emailToken")
    

    useEffect(()=>{
        let user={}
        fetch("https://localhost:3001/users/",{credentials:'include',})
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
        <h1>Hi</h1>
    )
}

export default Verifyuser