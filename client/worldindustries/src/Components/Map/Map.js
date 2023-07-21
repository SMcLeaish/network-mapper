import { MapContainer, TileLayer, Marker, Popup, LayersControl, LayerGroup } from 'react-leaflet'
import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css'
import { Icon, divIcon } from "leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';
import './Map.css';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';

function Map() {
    const options = [
        { label: 'Individual', id: 1 },
        { label: 'Organization', id: 2 },
        { label: 'Event', id: 3 },
      ];
    //   // or
    //   const options = ['Individual', 'Organization', 'Event'];
      const individualData = ['Fred Smith', 'Susan Woe', 'William Hunt'];
      const OrganizationData = ['NASA', 'Global Communication', 'Sprint'];
      const EventData = ['Sprint Conference', 'Comicon', 'SecurityCom'];


    const location = [29.304, 103.312];
    const zoom = 4;
    const { BaseLayer } = LayersControl;
    const [searchbox, setSearchBox] = useState(false)
    const [inputValue, setInputValue] = useState(options[0]);
    const [targetValue, setTargetValue] = useState('');

    const handleSearch = () => {
        setSearchBox(true)
    }


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
                            <div className='filterHeader'>
                                <Autocomplete
                                    inputValue={inputValue}
                                        onInputChange={(event, newInputValue) => {
                                        setInputValue(newInputValue);
                                        }}
                                    disablePortal
                                    id="combo-box-demo"
                                    options={options}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} label="Search Focus" />}/>
                                <div className='closeIcon'>
                                    <CloseIcon onClick={() => {setSearchBox(false)}}/>
                                </div>
                            </div>

                            <div className='secondSearch'>
                                {/* <FindDetails inputValue={inputValue}/> */}
                                {(inputValue === 'Individual') ?
                                    <Autocomplete
                                        inputValue={targetValue}
                                            onInputChange={(event, targetValue) => {
                                                setTargetValue(targetValue);
                                                }}
                                                disablePortal
                                                id="combo-box-demo"
                                                options={individualData}
                                                sx={{ width: 300 }}
                                                renderInput={(params) => <TextField {...params} label="Search Individual" />}/>

                                    :
                                    ( (inputValue === 'Organization')  ? 
                                        <Autocomplete
                                            inputValue={targetValue}
                                                onInputChange={(event, targetValue) => {setTargetValue(targetValue);}}
                                                disablePortal
                                                id="combo-box-demo"
                                                options={OrganizationData}
                                                sx={{ width: 300 }}
                                                renderInput={(params) => <TextField {...params} label="Search Organization" />}/>
                                    :
                                        <Autocomplete
                                            inputValue={targetValue}
                                            onInputChange={(event, targetValue) => {setTargetValue(targetValue);}}
                                            disablePortal
                                            id="combo-box-demo"
                                            options={EventData}
                                            sx={{ width: 300 }}
                                            renderInput={(params) => <TextField {...params} label="Search Event" />}/>                         
                                    )}
                            </div>
                        </div>
                        <div className='SearchContainer'>
                             <p>Search bar/button here</p>
                        </div>
                    </>
                    :
                    console.log(searchbox)
                    }
                </div>
                <div>
                    <div>
                        <MapContainer center={location} zoom={zoom}>
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
                        </MapContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Map;