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
import { useLocation, useNavigate } from 'react-router-dom';
import {  toast } from 'react-toastify';


const cityList = require('./Chinacities.json')

function Map() {
    const navigate=useNavigate()
    
    useEffect(()=>{
        fetch("https://localhost:3001/cookietest",{credentials:"include"})
        .then(res=>res.json())
        .then(data=>{
            console.log("data",data)
            if(data.success){
                console.log("data",data)
                toast('Welcome!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
            }else{
                toast("Please sign in", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
                    navigate('/login')
            }
    })        
},[])
    
    const filterstyle = {
        color: red,
    } 


    const options = [
        { label: 'Individual', location: [30,48] },
        { label: 'Organization', location: [31,48] },
        { label: 'Event', location: [32,48]},
      ];
    //   // or
    //   const options = ['Individual', 'Organization', 'Event'];
    //   const individualData = ['Fred Smith', 'Susan Woe', 'William Hunt'];

    const individualData = [
        {label: 'Fred Smith', location: [30.587, 114.228] },
        {label: 'Susan Woe',  location: [32.998, 112.529] },
        {label: 'William Hunt',location: [30.25, 120.167]}
    ];

      const OrganizationData = [
        {label: 'NASA', location: [31.1667, 121.4667] },
        {label: 'Global Communication', location: [39.904, 116.407] },
        {label: 'Sprint', location: [22.5350, 114.0633]}
    ];

      const EventData = [
        {label: 'Sprint Conference', location: [30.660, 104.0633]},
        {label: 'Comicon', location:[34.2667, 108.9]},
        {label: 'SecurityCom', location:[29.55, 106.50]}
      ];

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
    const [coord, setCoord] = useState(null)
    const [zoom, setZoom] = useState(4)
    const [lat, setLat] = useState(null)
    const [long, setLong] = useState(null)
    const { BaseLayer } = LayersControl;
    const [searchbox, setSearchBox] = useState(false)
    const [inputValue, setInputValue] = useState(options[0]);
    const [targetValue, setTargetValue] = useState('');
    const [detailsSelect, setDetailsSelect] = useState('')
    
    console.log(detailsSelect)

    const handleSearch = () => {
        setSearchBox(true)
        }

        
    return (
        <>

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
                                                individualData.find(info => (info.label === newtargetValue) ?  setCoord(info.location) : console.log(info.location))}
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
                                                    OrganizationData.find(info => (info.label === newtargetValue) ?  setCoord(info.location) : console.log(info.location))}
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
                                                EventData.find(info => (info.label === newtargetValue) ?  setCoord(info.location) : console.log(info.location))}

                                            }
                                            disablePortal
                                            id="combo-box-demo"
                                            options={EventData}
                                           
                                            sx={{ width: 300 }}
                                            renderInput={(params) => <TextField {...params} label="Search Event" />}/>                         
                                    )}
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
                    console.log(searchbox)
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

                                <LayersControl.Overlay name ="Individuals">
                                    <LayerGroup>
                                        <MarkerClusterGroup
                                            chunkedLoading
                                            iconCreateFunction={createCustomClusterIcon2}>
                                            {individualData.map(feature =>
                                                <Marker position={feature.location} icon={individualsIcon} eventHandlers={{
                                                    click: () => {setCoord(feature.location)},
                                                  }}>
                                                    <Popup>{feature.label}</Popup>
                                                </Marker>
                                            )},
                                        </MarkerClusterGroup>
                                    </LayerGroup>
                                </LayersControl.Overlay>

                                <LayersControl.Overlay name ="Organizations">
                                    <LayerGroup>
                                        <MarkerClusterGroup
                                            chunkedLoading
                                            iconCreateFunction={createCustomClusterIcon2}>
                                            {OrganizationData.map(feature =>
                                                <Marker position={feature.location} icon={individualsIcon} eventHandlers={{
                                                    click: () => {setCoord(feature.location)},
                                                  }}>
                                                    <Popup>{feature.label}</Popup>
                                                </Marker>
                                            )},
                                        </MarkerClusterGroup>
                                    </LayerGroup>
                                </LayersControl.Overlay>

                                <LayersControl.Overlay name ="Events">
                                    <LayerGroup>
                                        <MarkerClusterGroup
                                            chunkedLoading
                                            iconCreateFunction={createCustomClusterIcon2}>
                                            {EventData.map(feature =>
                                                <Marker position={feature.location} icon={individualsIcon} eventHandlers={{
                                                    click: () => {setCoord(feature.location)},
                                                  }}>
                                                    <Popup>{feature.label}</Popup>
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
        </>
    );
}

export default Map;