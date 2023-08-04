import React, { useEffect, useState } from "react";
import Map from "../Map/Map";
import { Polyline } from 'react-leaflet'
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';




const MultipleConnections = (props) => {
    const render = props.render
    // console.log('props are', props)
    const targetValue1= props.targetValue1
    const [entityConnect1, setEntityConnect1] = useState([]) 
    const [id1, setId1] = useState([])
    const [connectDetails1, setConnectDetails1] = useState([])
    const [primaryLocation1 , setPrimaryLocation1] = useState([]) 

    const targetValue2= props.targetValue2
    const [entityConnect2, setEntityConnect2] = useState([]) 
    const [id2, setId2] = useState([])
    const [connectDetails2, setConnectDetails2] = useState([])
    const [primaryLocation2 , setPrimaryLocation2] = useState([]) 

    const targetValue3= props.targetValue3
    const [entityConnect3, setEntityConnect3] = useState([]) 
    const [id3, setId3] = useState([])
    const [connectDetails3, setConnectDetails3] = useState([])
    const [primaryLocation3 , setPrimaryLocation3] = useState([]) 

    const targetValue4= props.targetValue4
    const [entityConnect4, setEntityConnect4] = useState([]) 
    const [id4, setId4] = useState([])
    const [connectDetails4, setConnectDetails4] = useState([])
    const [primaryLocation4 , setPrimaryLocation4] = useState([]) 

    const targetValue5= props.targetValue5
    const [entityConnect5, setEntityConnect5] = useState([]) 
    const [id5, setId5] = useState([])
    const [connectDetails5, setConnectDetails5] = useState([])
    const [primaryLocation5 , setPrimaryLocation5] = useState([]) 

    // console.log('targets', targetValue1, targetValue2, targetValue3, targetValue4, targetValue5)

//   const [individualConnect, setIndividualConnect] = useState([])

//   const [targetValue, setTargetValue] = useState([])
//   const [individualData, setIndividualData] = useState([])
//   const [coord, setCoord] = useState()
//   const [individualData2, setIndividualData2] = useState([])


  const [dataFetched, setdataFetched] = useState(false)


// //   target data for value 1
useEffect(() => {
    fetch(`https://localhost:3001/entity/${targetValue1}`)
      .then((res) => res.json())
      .then(data => {
        setEntityConnect1(data)
      })
      .catch(error=>console.log('i am not getting the data'))
  },[targetValue1])


useEffect(() => {
    entityConnect1.map((person) =>  (setId1(person.individual_entity_id), setPrimaryLocation1(person.individual_location)))
},[targetValue1, entityConnect1])

  useEffect(() => {
    fetch(`https://localhost:3001/relationships/${id1}`)
      .then((res) => res.json())
      .then(data => {
        setConnectDetails1(data)
        setdataFetched(true)
      })
      .catch(error=>console.log('i am not getting the data'))
  },[id1])


//   this is the fetch data for user 2

useEffect(() => {
    fetch(`https://localhost:3001/entity/${targetValue2}`)
      .then((res) => res.json())
      .then(data => {
        setEntityConnect2(data)
      })
      .catch(error=>console.log('i am not getting the data'))
  },[targetValue2])


useEffect(() => {
    entityConnect2.map((person) =>  (setId2(person.individual_entity_id), setPrimaryLocation2(person.individual_location)))
},[targetValue2, entityConnect2])

  useEffect(() => {
    fetch(`https://localhost:3001/relationships/${id2}`)
      .then((res) => res.json())
      .then(data => {
        setConnectDetails2(data)
        setdataFetched(true)
      })
      .catch(error=>console.log('i am not getting the data'))
  },[id2])


//   this section for user3
useEffect(() => {
    fetch(`https://localhost:3001/entity/${targetValue3}`)
      .then((res) => res.json())
      .then(data => {
        setEntityConnect3(data)
      })
      .catch(error=>console.log('i am not getting the data'))
  },[targetValue3])


useEffect(() => {
    entityConnect3.map((person) =>  (setId3(person.individual_entity_id), setPrimaryLocation3(person.individual_location)))
},[targetValue3,  entityConnect3])

  useEffect(() => {
    fetch(`https://localhost:3001/relationships/${id3}`)
      .then((res) => res.json())
      .then(data => {
        setConnectDetails3(data)
        setdataFetched(true)
      })
      .catch(error=>console.log('i am not getting the data'))
  },[id3])


  //   this section for user4
useEffect(() => {
    fetch(`https://localhost:3001/entity/${targetValue4}`)
      .then((res) => res.json())
      .then(data => {
        setEntityConnect4(data)
      })
      .catch(error=>console.log('i am not getting the data'))
  },[targetValue4])


useEffect(() => {
    entityConnect4.map((person) =>  (setId4(person.individual_entity_id), setPrimaryLocation4(person.individual_location)))
},[targetValue4,  entityConnect4])

  useEffect(() => {
    fetch(`https://localhost:3001/relationships/${id4}`)
      .then((res) => res.json())
      .then(data => {
        setConnectDetails4(data)
        setdataFetched(true)
      })
      .catch(error=>console.log('i am not getting the data'))
  },[id4])


  //   this section for user5
  useEffect(() => {
    fetch(`https://localhost:3001/entity/${targetValue5}`)
      .then((res) => res.json())
      .then(data => {
        setEntityConnect5(data)
      })
      .catch(error=>console.log('i am not getting the data'))
  },[targetValue5])


useEffect(() => {
    entityConnect5.map((person) =>  (setId5(person.individual_entity_id), setPrimaryLocation5(person.individual_location)))
},[targetValue5,  entityConnect5])

  useEffect(() => {
    fetch(`https://localhost:3001/relationships/${id5}`)
      .then((res) => res.json())
      .then(data => {
        setConnectDetails5(data)
        setdataFetched(true)
      })
      .catch(error=>console.log('i am not getting the data'))
  },[id5])


//   useEffect(() => {
//     entityConnect5.map((person) =>  (setId5(person.individual_entity_id), setPrimaryLocation5(person.individual_location)))
// },[targetValue5])

  useEffect(() => {
    console.log('need to render')
  },[render])

  if(dataFetched){
    console.log('primary person1', primaryLocation1);
    console.log('secondary person1 data', connectDetails1)
    console.log('primary person2', primaryLocation2);
    console.log('secondaryperson2 data', connectDetails2)
    console.log('primary person3', primaryLocation3);
    console.log('secondaryperson3 data', connectDetails3)
    console.log('primary person4', primaryLocation4);
    console.log('secondaryperson4 data', connectDetails4)
    console.log('primary person5', primaryLocation5);
    console.log('secondaryperson5 data', connectDetails5)
}

// console.log('realationships',connectDetails1)


  return (
    <>
    {console.log('realationships',connectDetails1)}

        
        <div> 
            {connectDetails1.map((person) => 
                (console.log(person.location, primaryLocation1),
                    <Polyline positions={[primaryLocation1, person.location]} color="red" />
                ))
            } 
        </div> 
        <div> 
            {connectDetails2.map((person2) => 
                (console.log(person2.location, primaryLocation2),
                    <Polyline positions={[primaryLocation2, person2.location]} color="blue" />
                ))
            } 
        </div> 
        <div> 
            {connectDetails3.map((person3) => 
                (console.log(person3.location, primaryLocation3),
                    <Polyline positions={[primaryLocation3, person3.location]} color="green" />
                ))
            } 
        </div> 
        <div> 
            {connectDetails4.map((person4) => 
                (console.log(person4.location, primaryLocation4),
                    <Polyline positions={[primaryLocation4, person4.location]} color="purple" />
                ))
            } 
        </div> 
        <div> 
            {connectDetails5.map((person5) => 
                (console.log(person5.location, primaryLocation5),
                    <Polyline positions={[primaryLocation5, person5.location]} color="orange" />
                ))
            } 
        </div> 
    </>
  )
}



export default MultipleConnections;

