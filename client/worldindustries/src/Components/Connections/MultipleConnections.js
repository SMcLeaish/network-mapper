import React, { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import Map from "../Map/Map";
import { Circle, Polyline } from 'react-leaflet'
import { Autocomplete, ToggleButton, ToggleButtonGroup } from '@mui/material';
import TextField from '@mui/material/TextField';




const Connections = (props) => {
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


  useEffect(() => {
    fetch('https://localhost:3001/individuals')
      .then((res) => res.json())
      .then(data => {
        setIndividualConnect(data)
      })
      .catch(error=>console.log('i am not getting the data'))
  },[])

//   console.log(individualConnect)

useEffect(() => {
    fetch(`https://localhost:3001/entity/${detailsSelect}`)
      .then((res) => res.json())
      .then(data => {
        setEntityConnect(data)
      })
      .catch(error=>console.log('i am not getting the data'))
  },[])

useEffect(() => {
    entityConnect.map((person) =>  setId(person.individual_entity_id))
    individualConnect.find(info => (info.name === detailsSelect) ?  setPrimaryLocation(info.location) : console.log())
    // individualConnect.map((loc) =>  setPrimaryLocation(loc[0].location))
},[entityConnect])

console.log(individualConnect, primaryLocation)

  useEffect(() => {
    fetch(`https://localhost:3001/relationships/${id}`)
      .then((res) => res.json())
      .then(data => {
        setConnectDetails(data)
      })
      .catch(error=>console.log('i am not getting the data'))
  },[id])

  return (
    <>
        <div>
        <Autocomplete 
            inputValue={targetValue1}
                onInputChange={(event, newtargetValue) => {
                                                // setTargetValue('')
                                          // setCoord([29.304, 103.312]);
                                                // setZoom(7)
                individualData.find(info => (info.label === newtargetValue) ?  setCoord(info.location) : console.log())}
                }
                disablePortal
                id="combo-box-demo"
                options={individualData}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Search Individual 1" />}/>
        </div>
        <div> 
            {connectDetails.map((person) => 
            (console.log(person.location, primaryLocation),
                <Polyline positions={[primaryLocation, person.location]} color="red" />
            ))
            }

        </div>
    </>
  )
}



export default Connections;