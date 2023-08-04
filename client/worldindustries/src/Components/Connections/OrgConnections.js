import React, { useEffect, useState } from "react";
// import { useMap } from "react-leaflet";
// import Map from "../Map/Map";
import { Circle, Polyline } from 'react-leaflet'


const OrgConnections = (props) => {
  const detailsSelect = props.details
//   const [orgConnect, setOrgConnect] = useState([])
//   const [entityConnect, setEntityConnect] = useState([]) 
//   const [id, setId] = useState([])
//   const [connectDetails, setConnectDetails] = useState([])
  const [primaryLocation , setPrimaryLocation] = useState([]) 
  const [secondaryLocations, setSecondaryLocations] = useState([])
//   const [searchData, setsearchData] = useState([])
  const [dataFetched, setdataFetched] = useState(false)


useEffect(() => {
    fetch(`https://localhost:3001/network/${detailsSelect}`)
      .then((res) => res.json())
      .then(data => {
            

        const selectedNode = data.nodes.find(node => node.name === detailsSelect)
        setPrimaryLocation(selectedNode.location);
       
        const seclocations = data.nodes.map(node => node.location)
        if(seclocations){
          setdataFetched(true)
        }
        setSecondaryLocations(seclocations)
        setdataFetched(true)


      })
      .catch(error=>console.log('i am not getting the data'))
  }, [detailsSelect])


    if(dataFetched){
        console.log('primary', primaryLocation);
        console.log('secondary data', secondaryLocations)
    }

  return (
    <>

        <div> 
        {secondaryLocations.map((location) => 
            // (console.log(location, primaryLocation),
                <Polyline positions={[primaryLocation, location]} color="red" />
            )
            }
        </div>
    </>
  )
}


// }
export default OrgConnections;