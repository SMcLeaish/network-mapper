import { MapContainer, TileLayer, Marker, Popup, LayersControl, LayerGroup } from 'react-leaflet'
import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css'
import { Icon, divIcon } from "leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';
import './Map.css';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete, FormLabel } from '@mui/material';
import TextField from '@mui/material/TextField';
import { ScaleControl } from 'react-leaflet';
import { MapController } from '../MapController/MapController';
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import { red } from '@mui/material/colors';
import { useMap } from 'react-leaflet';
import { useNavigate } from 'react-router';


const cityList = require('./Chinacities.json')

function Map() {
    const filterstyle = {
        color: red,
    } 

    const options = [
        { label: 'Individual', location: [30,48] },
        { label: 'Organization', location: [31,48] },
        { label: 'Event', location: [32,48]},
      ];

    const [individualData2, setIndividualData2] = useState([])
    const [individualData, setIndividualData] = useState([])

      useEffect(() => {
        fetch('https://localhost:3001/individuals')
          .then((res) => res.json())
          .then(data => {
            setIndividualData2(data)
          })
          .catch(error=>console.log('i am not getting the data'))
      },[])


      const [OrganizationData2, setOrganizationData2] = useState([])
      const [OrganizationData, setOrganizationData] = useState([])
  
        useEffect(() => {
          fetch('https://localhost:3001/organizations')
            .then((res) => res.json())
            .then(data => {
                setOrganizationData2(data)
            })
            .catch(error=>console.log('i am not getting the data for organizations'))
        },[])


        const [EventData2, setEventData2] = useState([])
        const [EventData, setEventData] = useState([])
    
          useEffect(() => {
            fetch('https://localhost:3001/events')
              .then((res) => res.json())
              .then(data => {
                setEventData2(data)
              })
              .catch(error=>console.log('i am not getting the data for event'))
          },[])


        useEffect(() => {
            for (let i = 0; i < individualData2.length; i++) {
                const nameValue = individualData2[i].name;
                individualData2[i].label = nameValue;
              }
              setIndividualData(individualData2)
    
              for (let i = 0; i < OrganizationData2.length; i++) {
                const nameValue = OrganizationData2[i].name;
                OrganizationData2[i].label = nameValue;
              }
              setOrganizationData(OrganizationData2)
    
              for (let i = 0; i < EventData2.length; i++) {
                const nameValue = EventData2[i].event_name;
                EventData2[i].label = nameValue;
              }
              setEventData(EventData2)
          },[individualData2])


      const customIcon = new Icon({
        iconUrl: require('../../img/location.png'),
        iconSize: [38, 38]
    })


    const individualsIcon = new Icon({
        iconUrl: require('../../img/user.png'),
        iconSize: [38, 38]
    })

    const createCustomClusterIcon = (cluster) => {
        return new divIcon({
            html: `<div class='cluster-icon'>${cluster.getChildCount()}</div`,
            className: 'custom-marker-cluster',
        });
    }

    const createCustomClusterIcon2 = (cluster) => {
        return new divIcon({
            html: `<div class='cluster-icon2'>${cluster.getChildCount()}</div`,
            className: 'custom-marker-cluster',
        });
    }

    // const location = [29.304, 103.312];
    // const zoom = 4;
    const mapRef = useRef();
    const navigate = useNavigate()
    const [coord, setCoord] = useState(null)
    const [zoom, setZoom] = useState(4)
    const [lat, setLat] = useState(null)
    const [long, setLong] = useState(null)
    const { BaseLayer } = LayersControl;
    const [searchbox, setSearchBox] = useState(false)
    const [inputValue, setInputValue] = useState(options[0]);
    const [targetValue, setTargetValue] = useState('');
    const [detailsSelect, setDetailsSelect] = useState('')
    
    const handleSearch = () => {
        setSearchBox(true)
        }

    console.log(detailsSelect)
    console.log(inputValue)
    
    return (
        <div className="Map">
            <div className='Container'>
                <div className='ManageSearch'>
                    <ManageSearchIcon onClick={() => {handleSearch()}}/>
                </div>
                <div>
                    {searchbox ? 
                    <>
                        <div className='filterContainer'>
                            <CloseIcon className='closeIcon' onClick={() => {setSearchBox(false)}}/>
                            <div className='filterHeader'>
                                <Autocomplete
                                    inputValue={inputValue}
                                        onInputChange={(event, newInputValue) => {
                                        setInputValue(newInputValue);
                                        }}
                                    disablePortal
                                    id="combo-box-demo"
                                    options={options}
                                    sx={{ width: 300  }}
                                    renderInput={(params) => <TextField {...params} label="Search Focus"  />}/>
                                
                            </div>

                            <div className='secondSearch'>
                                {/* <FindDetails inputValue={inputValue}/> */}
                                {(inputValue === 'Individual') ?
                                    <Autocomplete style={filterstyle}
                                        inputValue={targetValue}
                                            onInputChange={(event, newtargetValue) => {
                                                // setTargetValue('')
                                                setTargetValue(newtargetValue);
                                                setDetailsSelect(newtargetValue);
                                                // setCoord([29.304, 103.312]);
                                                // setZoom(7)
                                                individualData.find(info => (info.label === newtargetValue) ?  setCoord(info.location) : console.log())}
                                                }
                                                disablePortal
                                                id="combo-box-demo"
                                                options={individualData}
                                                sx={{ width: 300 }}
                                                renderInput={(params) => <TextField {...params} label="Search Individual" />}/>
                                                
                                    :
                                    ( (inputValue === 'Organization')  ? 
                                        <Autocomplete
                                            inputValue={targetValue}
                                                onInputChange={(event, newtargetValue) => {
                                                    setTargetValue(newtargetValue);
                                                    setDetailsSelect(newtargetValue);
                                                    // setCoord([29.304, 103.312]);
                                                    // setZoom(7)
                                                    OrganizationData.find(info => (info.label === newtargetValue) ?  setCoord(info.location) : console.log())}
                                                }
                                                disablePortal
                                                id="combo-box-demo"
                                                options={OrganizationData}
                                                sx={{ width: 300 }}
                                                renderInput={(params) => <TextField {...params} label="Search Organization" />}/>
                                    :
                                        <Autocomplete
                                            inputValue={targetValue}
                                            onInputChange={(event, newtargetValue) => {
                                                setTargetValue(newtargetValue);
                                                setDetailsSelect(newtargetValue);
                                                // setCoord([29.304, 103.312]);
                                                // setZoom(7)
                                                EventData.find(info => (info.label === newtargetValue) ?  setCoord(info.location) : console.log())}

                                            }
                                            disablePortal
                                            id="combo-box-demo"
                                            options={EventData}
                                           
                                            sx={{ width: 300 }}
                                            renderInput={(params) => <TextField {...params} label="Search Event" />}/>                         
                                    )}
                            </div>
                                    {/* this is for the small details area */}
                            <div className='MapSummary'>
                                {inputValue === 'Individual' ? 
                                    <div> 
                                        {individualData.map((person) => person.name === detailsSelect ? 
                                        <>
                                            <h1> Search Summary </h1>
                                            <p>Name: {person.name}</p> 
                                            <p>Phone: {person.phone_number}</p>
                                            <p>Location: {JSON.stringify(person.location)}</p>

                                        </>
                                        : console.log(`member not found`)
                                         )}
                                    </div>
                                :
                                ( inputValue === 'Organization' ?
                                    <div> 
                                    {OrganizationData.map((org) => org.name === detailsSelect ? 
                                    <>
                                        <h1> Search Summary </h1>
                                        <p>Name: {org.name}</p> 
                                        <p>Location: {JSON.stringify(org.location)}</p>

                                    </>
                                    : console.log(`member not found`)
                                    )}
                                    </div>
                                :
                                (inputValue === 'Event' ? 
                                <div> 
                                {EventData.map((org) => org.event_name === detailsSelect ? 
                                <>
                                    <h1> Search Summary </h1>
                                    <p>Name: {org.event_name}</p> 
                                    <p>Phone: {org.date}</p>
                                    <p>Location: {JSON.stringify(org.location)}</p>

                                </>
                                : console.log(`member not found`)
                                )}
                                </div>
                                :
                                console.log('none of them match')
                                ))}
                            </div>


                            <div className='latLongSearch'>
                                <form className='latLongSearch' autocomplete="off">
                                    <div className='searchfield'>
                                        <TextField label='Latitude'  onChange={ (e) => setLat(e.target.value) }/>
                                    </div>
                                    <div className='searchfield'>
                                        <TextField label='Longitude'  onChange={ (e) => setLong(e.target.value)}/>
                                    </div>
                                    <PersonSearchIcon className='locationSearch' onClick={() => {setCoord([lat, long])}}/>
                                </form>
                            </div>
                        </div>
                    </>
                    :
                    console.log()
                    }
                </div>
                <div>
                    <div>
                        <MapContainer center={[29.304, 103.312]} zoom={zoom} ref={mapRef} id='map'>
                            <LayersControl>
                                <BaseLayer checked name="OpenStreetMap">
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors" />
                                </BaseLayer>

                                <BaseLayer name="World Imagery">
                                    <TileLayer
                                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                    attribution="&copy; Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                                    maxNativeZoom={8}
                                    />
                                </BaseLayer>

                                <BaseLayer name="NASA Gibs Blue Marble">
                                    <TileLayer
                                    url="https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default//EPSG3857_500m/{z}/{y}/{x}.jpeg"
                                    attribution="&copy; NASA Blue Marble, image service by OpenGeo"
                                    maxNativeZoom={8}
                                    />
                                </BaseLayer>
                            </LayersControl>
                        <LayersControl position='topright' id='custom-icon'>
                                <LayersControl.Overlay name ="Cities">
                                    <LayerGroup>
                                        <MarkerClusterGroup
                                            chunkedLoading
                                            iconCreateFunction={createCustomClusterIcon}>
                                            {cityList.map(feature =>
                                                <Marker position={[feature.lat, feature.lng]} icon={customIcon}>
                                                    <Popup>{feature.name}</Popup>
                                                </Marker>
                                            )},
                                        </MarkerClusterGroup>
                                    </LayerGroup>
                                </LayersControl.Overlay>

                                <LayersControl.Overlay checked name ="Individuals">
                                    <LayerGroup>
                                        <MarkerClusterGroup
                                            chunkedLoading
                                            iconCreateFunction={createCustomClusterIcon2}>
                                            {individualData.map(feature =>
                                                <Marker position={feature.location} icon={individualsIcon} eventHandlers={{
                                                    click: () => {setCoord(feature.location)},
                                                  }}>
                                                    <Popup>
                                                        <h3>Name: {feature.name}</h3> 
                                                        <p>Phone: {feature.phone_number}</p>
                                                        <p>Location: {JSON.stringify(feature.location)}</p>
                                                        <PersonSearchIcon className='' onClick={(e) => navigate(`/details`,{ state: feature.name})}/>

                                                    </Popup>
                                                </Marker>
                                            )},
                                        </MarkerClusterGroup>
                                    </LayerGroup>
                                </LayersControl.Overlay>

                                <LayersControl.Overlay checked name ="Organizations">
                                    <LayerGroup>
                                        <MarkerClusterGroup
                                            chunkedLoading
                                            iconCreateFunction={createCustomClusterIcon2}>
                                            {OrganizationData.map(feature =>
                                                <Marker position={feature.location} icon={individualsIcon} eventHandlers={{
                                                    click: () => {setCoord(feature.location)},
                                                  }}>
                                                     <Popup>
                                                        <h3>Name: {feature.name}</h3> 
                                                        <p>Location: {JSON.stringify(feature.location)}</p>
                                                        <PersonSearchIcon className='' onClick={(e) => navigate(`/details`,{ state: feature.name})}/>

                                                    </Popup>
                                                </Marker>
                                            )},
                                        </MarkerClusterGroup>
                                    </LayerGroup>
                                </LayersControl.Overlay>

                                <LayersControl.Overlay checked name ="Events">
                                    <LayerGroup>
                                        <MarkerClusterGroup
                                            chunkedLoading
                                            iconCreateFunction={createCustomClusterIcon2}>
                                            {EventData.map(feature =>
                                                <Marker position={feature.location} icon={individualsIcon} eventHandlers={{
                                                    click: () => {setCoord(feature.location)},
                                                  }}>
                                                    <Popup>
                                                        <h3>Name: {feature.event_name}</h3> 
                                                        <p>Phone: {feature.date}</p>
                                                        <p>Location: {JSON.stringify(feature.location)}</p>
                                                        <PersonSearchIcon className='' onClick={(e) => navigate(`/details`,{ state: feature.event_name})}/>
                                                    </Popup>
                                                </Marker>
                                            )},
                                        </MarkerClusterGroup>
                                    </LayerGroup>
                                </LayersControl.Overlay>

                            </LayersControl>
                            <MapController coord={coord}/>
                            <ScaleControl position='topleft' />    
                        </MapContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Map;