import React, { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import Map from "../Map/Map";
import { Circle, Polyline } from 'react-leaflet'
import { Autocomplete, ToggleButton, ToggleButtonGroup } from '@mui/material';
import TextField from '@mui/material/TextField';




const MultipleConnections = (props) => {
  const detailsSelect = props.details
  const [individualConnect, setIndividualConnect] = useState([])
  const [entityConnect, setEntityConnect] = useState([]) 
  const [id, setId] = useState([])
  const [connectDetails, setConnectDetails] = useState([])
  const [primaryLocation , setPrimaryLocation] = useState([]) 
  const [targetValue1, setTargetValue1] = useState()
  const [targetValue2, setTargetValue2] = useState()
  const [targetValue3, setTargetValue3] = useState()
  const [targetValue4, setTargetValue4] = useState()
  const [targetValue5, setTargetValue5] = useState()
  const [individualData, setIndividualData] = useState([])
  const [coord, setCoord] = useState()
  const [individualData2, setIndividualData2] = useState([])

  useEffect(() => {
    fetch('https://localhost:3001/individuals')
      .then((res) => res.json())
      .then(data => {
        setIndividualData2(data)
      })
      .catch(error=>console.log('i am not getting the data'))
  },[])

//   console.log(individualConnect)

useEffect(() => {
    fetch(`https://localhost:3001/entity/${targetValue1}`)
      .then((res) => res.json())
      .then(data => {
        setEntityConnect(data)
      })
      .catch(error=>console.log('i am not getting the data'))
  },[])

useEffect(() => {
    entityConnect.map((person) =>  setId(person.individual_entity_id))
    individualConnect.find(info => (info.name === targetValue1) ?  setPrimaryLocation(info.location) : console.log())
    // individualConnect.map((loc) =>  setPrimaryLocation(loc[0].location))
},[entityConnect])

// console.log(individualConnect, primaryLocation)

  useEffect(() => {
    fetch(`https://localhost:3001/relationships/${id}`)
      .then((res) => res.json())
      .then(data => {
        setConnectDetails(data)
      })
      .catch(error=>console.log('i am not getting the data'))
  },[id])

  useEffect(() => {
    for (let i = 0; i < individualData2.length; i++) {
        const nameValue = individualData2[i].name;
        individualData2[i].label = nameValue;
      }
      setIndividualData(individualData2)
  },[individualData2])


  return (
    <>
        <div>
        <Autocomplete 
            inputValue={targetValue1}
                onInputChange={(event, targetValue1) => {
                                                // setTargetValue('')
                                          // setCoord([29.304, 103.312]);
                                                // setZoom(7)
                individualData.find(info => (info.label === targetValue1) ?  setCoord(info.location) : console.log())}
                }
                disablePortal
                id="combo-box-demo"
                options={individualData}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Search Individual 1" margin='normal' />}/>
        </div>
        <div>
        <Autocomplete 
            inputValue={targetValue2}
                onInputChange={(event, targetValue1) => {
                                                // setTargetValue('')
                                          // setCoord([29.304, 103.312]);
                                                // setZoom(7)
                individualData.find(info => (info.label === targetValue2) ?  setCoord(info.location) : console.log())}
                }
                disablePortal
                id="combo-box-demo"
                options={individualData}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Search Individual 2" margin='normal' />}/>
        </div>
        
        {/* <div> 
            {connectDetails.map((person) => 
            (console.log(person.location, primaryLocation),
                <Polyline positions={[primaryLocation, person.location]} color="red" />
            ))
            }

        </div> */}
    </>
  )
}



export default MultipleConnections;