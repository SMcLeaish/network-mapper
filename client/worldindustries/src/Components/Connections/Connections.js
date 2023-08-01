import React, { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import Map from "../Map/Map";
import { Circle, Polyline } from 'react-leaflet'


const Connections = (props) => {
  const detailsSelect = props.details
  const [individualConnect, setIndividualConnect] = useState([])
  const [entityConnect, setEntityConnect] = useState([]) 
  const [id, setId] = useState([])
  const [connectDetails, setConnectDetails] = useState([])
  const [primaryLocation , setPrimaryLocation] = useState([]) 


  useEffect(() => {
    fetch('http://localhost:3001/individuals')
      .then((res) => res.json())
      .then(data => {
        setIndividualConnect(data)
      })
      .catch(error=>console.log('i am not getting the data'))
  },[])

//   console.log(individualConnect)

useEffect(() => {
    fetch(`http://localhost:3001/entity/${detailsSelect}`)
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

// console.log(individualConnect, primaryLocation)

  useEffect(() => {
    fetch(`http://localhost:3001/relationships/${id}`)
      .then((res) => res.json())
      .then(data => {
        setConnectDetails(data)
      })
      .catch(error=>console.log('i am not getting the data'))
  },[id])

  return (
    <>
        <div> 
            {connectDetails.map((person) => 
            // (console.log(person.location, primaryLocation),
                <Polyline positions={[primaryLocation, person.location]} color="red" />
            )
            }

        </div>
        {/* <div>
                {entityConnect.map((person) => 
                (console.log(person.individual_location, person.event_location),
                <Polyline positions={[person.individual_location, person.event_location]} color="green" />

            ))}
        </div> */}
    </>
  )
}



export default Connections;