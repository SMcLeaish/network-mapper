import { MapContainer, TileLayer, Marker, Popup, LayersControl, LayerGroup } from 'react-leaflet'
import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css'
import { Icon, divIcon } from "leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';
import './Map.css';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import IconButton from '@mui/material/IconButton';
import InsightsIcon from '@mui/icons-material/Insights'
import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import { ScaleControl } from 'react-leaflet';
import { MapController } from '../MapController/MapController';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ShareIcon from '@mui/icons-material/Share';
import { red } from '@mui/material/colors';
import { useMap } from 'react-leaflet';
import { useNavigate } from 'react-router';
import Connections from '../Connections/Connections';
import EventConnections from '../Connections/EventConnections';
import OrgConnections from '../Connections/OrgConnections';
import GroupsIcon from '@mui/icons-material/Groups'
import { Circle } from 'react-leaflet';
import TravelExploreIcon from '@mui/icons-material/TravelExplore'
import { forward, toPoint } from 'mgrs';
import DetailsPage from '../DetailsPage/DetailsPage';
import MultipleConnections from '../Connections/MultipleConnections';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import GraphDialog from '../Graph/GraphDialog';
import Tooltip from '@mui/material/Tooltip'


const cityList = require('./Chinacities.json')

//this is a small change
function Map() {
    const filterstyle = {
        color: red,
    }

    const options = [
        { label: 'Individual', location: [30, 48] },
        { label: 'Organization', location: [31, 48] },
        { label: 'Event', location: [32, 48] },
    ];

    const [individualData2, setIndividualData2] = useState([])
    const [individualData, setIndividualData] = useState([])

    useEffect(() => {
        fetch('https://localhost:3001/individuals')
            .then((res) => res.json())
            .then(data => {
                setIndividualData2(data)
            })
            .catch(error => console.log('i am not getting the data'))
    }, [])

    // console.log('indiv data 2: ',individualData2)
    // console.log('indiv data after change: ',individualData)


    const [OrganizationData2, setOrganizationData2] = useState([])
    const [OrganizationData, setOrganizationData] = useState([])

    useEffect(() => {
        fetch('https://localhost:3001/organizations')
            .then((res) => res.json())
            .then(data => {
                setOrganizationData2(data)
            })
            .catch(error => console.log('i am not getting the data for organizations'))
    }, [])


    const [EventData2, setEventData2] = useState([])
    const [EventData, setEventData] = useState([])

    useEffect(() => {
        fetch('https://localhost:3001/events')
            .then((res) => res.json())
            .then(data => {
                setEventData2(data)
            })
            .catch(error => console.log('i am not getting the data for event'))
    }, [])


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
    }, [individualData2])





    const customIcon = new Icon({
        iconUrl: require('../../img/business-building-svgrepo-com.png'),
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
    const [lat, setLat] = useState(null)
    const [long, setLong] = useState(null)
    const { BaseLayer } = LayersControl;
    const [searchbox, setSearchBox] = useState(false)
    const [inputValue, setInputValue] = useState(options[0]);
    const [targetValue, setTargetValue] = useState('');
    const [detailsSelect, setDetailsSelect] = useState(null)
    const [poly, setPolyLine] = useState(false)
    const [eventpoly, seteventPolyLine] = useState(false)
    const [Orgpoly, setOrgPolyLine] = useState(false)
    const [MGRSvalue, setMGRSvalue] = useState('')
    const [MGRSConversion, setMGRSConversion] = useState(null)
    const [searchSet, setSearch] = useState(false)
    const [entityConnect, setEntityConnect] = useState(1)
    const [modeValue, setMode] = useState(false)
    const [targetValue1, setTargetValue1] = useState()
    const [targetValue2, setTargetValue2] = useState()
    const [targetValue3, setTargetValue3] = useState()
    const [targetValue4, setTargetValue4] = useState()
    const [targetValue5, setTargetValue5] = useState()
    const [render, setrender] = useState(false)
    // const multipleList = []
    console.log(`render value:`, render)
    // console.log('this is the list:', multipleList)

    useEffect(() => {
        if (detailsSelect) {
            fetch(`https://localhost:3001/entity/${detailsSelect}`)
                .then((res) => res.json())
                .then(data => {
                    setEntityConnect(data[0].primary_entity_id)
                    console.log(data[0].primary_entity_id)

                })
                .catch(error => console.log('i am not getting the data'))
        }
    }, [detailsSelect])


    // console.log('ENTITY CONNECT', entityConnect)



    const handleSearch = () => {
        setSearchBox(true)
    }

    const resetPolyLines = () => {
        // if (modeValue !== true) {
        seteventPolyLine(false)
        setPolyLine(false)
        setOrgPolyLine(false)
        // } else {
        //     console.log('single')
        // }
    }

    const handleMGRS = (long, lat) => {
        // 17SPU7853083668

        const longNum = parseFloat(long)
        const latNum = parseFloat(lat)
        let lonlat = [longNum, latNum]
        console.log('numbers are', longNum, latNum)
        console.log(forward(lonlat))
        setMGRSConversion(forward(lonlat))
        setSearch(true)

    }

    const handleMGRSSearch = (MGRSvalue) => {
        console.log(MGRSvalue)
        let value = (toPoint(MGRSvalue))
        console.log(value)
        let temp = value[0];
        value[0] = value[1];
        value[1] = temp
        console.log(value)
        setCoord(value)
        setSearch(true)
    }

    // console.log(`detailsSelect = ${detailsSelect}`);

    // added for modal
    const [open, setOpen] = useState(false);

    const handleOpenDetailsDialog = (name) => {
        setOpen(true);
        setDetailsSelect(name)
    };

    const handleCloseDetailsDialog = () => {
        setOpen(false);
    };
    // end added for modal
    const [analyzeDialogOpen, setAnalyzeDialogOpen] = useState(false)
    const handleAnalyzeDialogOpen = (name) => {
        setAnalyzeDialogOpen(true);

    }
    const handleAnalyzeDialogClose = (name) => {
        setAnalyzeDialogOpen(false);
    }
    const [searchSwitchChecked, setSearchSwitchChecked] = useState(false);

    const handleSearchSwitch = (event) => {
        setSearchSwitchChecked(event.target.checked);
        setMode(!modeValue);
    }

    console.log('targetvalue1', targetValue1)
    console.log('targetvalue2', targetValue2)

    return (
        <>
            <div className="Map">
                <div className='Container'>
                    <div className='ManageSearch'>
                        <ManageSearchIcon onClick={() => { handleSearch() }} />
                    </div>
                    <div>
                        {searchbox ?
                            <>
                                <div className='filterContainer'>
                                    <CloseIcon className='closeIcon' onClick={() => { setSearchBox(false) }} />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={searchSwitchChecked}
                                                onChange={handleSearchSwitch}
                                            />
                                        }
                                        label="Map Multiple Relationships"
                                        className='searchSwitch'
                                    />

                                    {/* <ManageSearchIcon className= {modeValue ? 'activelines' : 'notActiveLines'}  onClick={() => {setMode(!modeValue)}}/> */}


                                    {!modeValue ?
                                        <div>
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
                                                    renderInput={(params) => <TextField {...params} label="Search Focus" margin='normal' />} />
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
                                                            resetPolyLines()                                                // setCoord([29.304, 103.312]);
                                                            // setZoom(7)
                                                            individualData.find(info => (info.label === newtargetValue) ? setCoord(info.location) : console.log())
                                                        }
                                                        }
                                                        disablePortal
                                                        id="combo-box-demo"
                                                        options={individualData}
                                                        sx={{ width: 300 }}
                                                        renderInput={(params) => <TextField {...params} label="Search Individual" margin='normal' />} />

                                                    :
                                                    ((inputValue === 'Organization') ?
                                                        <Autocomplete
                                                            inputValue={targetValue}
                                                            onInputChange={(event, newtargetValue) => {
                                                                setTargetValue(newtargetValue);
                                                                setDetailsSelect(newtargetValue);
                                                                resetPolyLines()

                                                                // setCoord([29.304, 103.312]);
                                                                // setZoom(7)
                                                                OrganizationData.find(info => (info.label === newtargetValue) ? setCoord(info.location) : console.log())
                                                            }
                                                            }
                                                            disablePortal
                                                            id="combo-box-demo"
                                                            options={OrganizationData}
                                                            sx={{ width: 300 }}
                                                            renderInput={(params) => <TextField {...params} label="Search Organization" margin='normal' />} />
                                                        :
                                                        <Autocomplete
                                                            inputValue={targetValue}
                                                            onInputChange={(event, newtargetValue) => {
                                                                setTargetValue(newtargetValue);
                                                                setDetailsSelect(newtargetValue);
                                                                resetPolyLines()

                                                                // setCoord([29.304, 103.312]);
                                                                // setZoom(7)
                                                                EventData.find(info => (info.label === newtargetValue) ? setCoord(info.location) : console.log())
                                                            }

                                                            }
                                                            disablePortal
                                                            id="combo-box-demo"
                                                            options={EventData}

                                                            sx={{ width: 300 }}
                                                            renderInput={(params) => <TextField {...params} label="Search Event" margin='normal' />} />
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
                                                                <ShareIcon className={poly ? 'activelines' : 'notActiveLines'} onClick={() => { setPolyLine(!poly) }} />
                                                                <GroupsIcon className={eventpoly ? 'Eventactiveline' : 'EventnotActiveLines'} onClick={() => { seteventPolyLine(!eventpoly) }} />
                                                                {/* <PersonSearchIcon className='DetailsIcon' onClick={(e) => navigate(`/details/${entityConnect}`)}/> */}
                                                                <Tooltip title="Details">
                                                                <PersonSearchIcon className='DetailsIcon' onClick={handleOpenDetailsDialog} />
                                                                </Tooltip>
                                                                <Tooltip title="Analyze">

                                                                <IconButton onClick={handleAnalyzeDialogOpen}><InsightsIcon/></IconButton>
                                                                </Tooltip>
                                                            </>
                                                            : console.log(`member not found`)
                                                        )}
                                                    </div>
                                                    :
                                                    (inputValue === 'Organization' ?
                                                        <div>
                                                            {OrganizationData.map((org) => org.name === detailsSelect ?
                                                                <>
                                                                    <h1> Search Summary </h1>
                                                                    <p>Name: {org.name}</p>
                                                                    <p>Location: {JSON.stringify(org.location)}</p>
                                                                    <ShareIcon className={Orgpoly ? 'activelines' : 'notActiveLines'} onClick={() => { setOrgPolyLine(!Orgpoly) }} />
                                                                    <PersonSearchIcon className='OrgDetailsIcon' onClick={handleOpenDetailsDialog} />


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
                                                                        <p>Date: {org.date}</p>
                                                                        {/* <p>Type: {org.type}</p> */}
                                                                        <p>Location: {JSON.stringify(org.location)}</p>
                                                                        {/* <PersonSearchIcon className='DetailsIcon' onClick={(e) => navigate(`/details/${entityConnect}`)}/> */}
                                                                    </>
                                                                    : console.log(`member not found`)
                                                                )}
                                                            </div>
                                                            :
                                                            console.log('none of them match')
                                                        ))}
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <Autocomplete
                                                inputValue={targetValue1}
                                                onInputChange={(event, newtargetValue1) => {
                                                    setrender(!render)
                                                    setTargetValue1(newtargetValue1)
                                                }}
                                                disablePortal
                                                id="combo-box-demo"
                                                options={individualData}
                                                sx={{ width: 300 }}
                                                renderInput={(params) => <TextField {...params} label="Individual 1" margin='normal' />} />

                                            <Autocomplete
                                                inputValue={targetValue2}
                                                onInputChange={(event, newtargetValue2) => {
                                                    setrender(!render)
                                                    setTargetValue2(newtargetValue2)
                                                }}
                                                disablePortal
                                                id="combo-box-demo"
                                                options={individualData}
                                                sx={{ width: 300 }}
                                                renderInput={(params) => <TextField {...params} label="Individual 2" margin='normal' />} />

                                            <Autocomplete
                                                inputValue={targetValue3}
                                                onInputChange={(event, newtargetValue3) => {
                                                    setrender(!render)
                                                    setTargetValue3(newtargetValue3)
                                                }}
                                                disablePortal
                                                id="combo-box-demo"
                                                options={individualData}
                                                sx={{ width: 300 }}
                                                renderInput={(params) => <TextField {...params} label="Individual 3" margin='normal' />} />

                                            <Autocomplete
                                                inputValue={targetValue4}
                                                onInputChange={(event, newtargetValue4) => {
                                                    setrender(!render)
                                                    setTargetValue4(newtargetValue4)
                                                }}
                                                disablePortal
                                                id="combo-box-demo"
                                                options={individualData}
                                                sx={{ width: 300 }}
                                                renderInput={(params) => <TextField {...params} label="Individual 4" margin='normal' />} />

                                            <Autocomplete
                                                inputValue={targetValue5}
                                                onInputChange={(event, newtargetValue5) => {
                                                    setrender(!render)
                                                    setTargetValue5(newtargetValue5)
                                                }}
                                                disablePortal
                                                id="combo-box-demo"
                                                options={individualData}
                                                sx={{ width: 300 }}
                                                renderInput={(params) => <TextField {...params} label="Individual 5" margin='normal' />} />

                                        </div>

                                    }



                                    <div className='latLongSearch'>
                                        <form className='latLongSearch' autoComplete="off">
                                            <div className='searchfield'>
                                                <TextField label='Latitude' onChange={(e) => setLat(e.target.value)} />
                                            </div>
                                            <div className='searchfield'>
                                                <TextField label='Longitude' onChange={(e) => setLong(e.target.value)} />
                                            </div>
                                            <TravelExploreIcon className='locationSearch' onClick={() => { setCoord([lat, long], handleMGRS(long, lat)) }} />
                                        </form>
                                    </div>
                                    <div>
                                        <form className='latLongSearch' autoComplete="off">
                                            <div className='searchfield'>
                                                <TextField label='MGRS Search' onChange={(e) => setMGRSvalue(e.target.value)} />
                                            </div>
                                            <TravelExploreIcon className='locationSearch' onClick={() => { handleMGRSSearch(MGRSvalue) }} />
                                        </form>
                                    </div>
                                    {MGRSConversion !== null ? <p className='mgrsConversion'>{`Lat/Long ⮕ MGRS: ${MGRSConversion}`}</p> : console.log('')}
                                </div>
                            </>
                            :
                            console.log()
                        }
                    </div>
                    <div>
                        <div>
                            <MapContainer center={[13.57406, 108.18783]} zoom={6} ref={mapRef} id='map'>
                                <LayersControl>
                                    <BaseLayer name="OpenStreetMap">
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors" />
                                    </BaseLayer>

                                    {/* <BaseLayer name="World Imagery">
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
                                </BaseLayer> */}

                                    <BaseLayer name="Google Imagery">
                                        <TileLayer
                                            url='https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                                            maxZoom={20}
                                            subdomains={['mt1', 'mt2', 'mt3']}
                                        />
                                    </BaseLayer>

                                    <BaseLayer checked name="Terrain">
                                        <TileLayer
                                            url='http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}'
                                            maxZoom={20}
                                            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                                        />
                                    </BaseLayer>

                                </LayersControl>
                                <LayersControl position='topright' id='custom-icon'>
                                    <LayersControl.Overlay name="Cities">
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

                                    <LayersControl.Overlay checked name="Individuals">
                                        <LayerGroup>
                                            <MarkerClusterGroup
                                                chunkedLoading
                                                iconCreateFunction={createCustomClusterIcon2}>
                                                {individualData.map(feature =>
                                                    <Marker position={feature.location} icon={individualsIcon} eventHandlers={{
                                                        click: () => { setCoord(feature.location) },
                                                    }}>
                                                        <Popup>
                                                            <h3>Name: {feature.name}</h3>
                                                            <p>Phone: {feature.phone_number}</p>
                                                            <p>Location: {JSON.stringify(feature.location)}</p>
                                                            {/* <PersonSearchIcon className='DetailsIcon' onClick={(e) => navigate(`/details/${entityConnect}`)}/> */}
                                                            <PersonSearchIcon className='DetailsIcon' onClick={() => handleOpenDetailsDialog(feature.name)} />
                                                        </Popup>
                                                    </Marker>
                                                )},
                                            </MarkerClusterGroup>
                                        </LayerGroup>
                                    </LayersControl.Overlay>

                                    <LayersControl.Overlay checked name="Organizations">
                                        <LayerGroup>
                                            <MarkerClusterGroup
                                                chunkedLoading
                                                iconCreateFunction={createCustomClusterIcon2}>
                                                {OrganizationData.map(feature =>
                                                    <Marker position={feature.location} icon={customIcon} eventHandlers={{
                                                        click: () => { setCoord(feature.location) },
                                                    }}>
                                                        <Popup>
                                                            <h3>Name: {feature.name}</h3>
                                                            <p>Location: {JSON.stringify(feature.location)}</p>
                                                            {/* <PersonSearchIcon className='OrgDetailsIcon' onClick={(e) => navigate(`/details/${entityConnect}`)}/> */}
                                                            <PersonSearchIcon className='OrgDetailsIcon' onClick={() => handleOpenDetailsDialog(feature.name)} />
                                                        </Popup>
                                                    </Marker>
                                                )},
                                            </MarkerClusterGroup>
                                        </LayerGroup>
                                    </LayersControl.Overlay>

                                    <LayersControl.Overlay checked name="Events">
                                        <LayerGroup>
                                            <MarkerClusterGroup
                                                chunkedLoading
                                                iconCreateFunction={createCustomClusterIcon2}>
                                                {EventData.map(feature =>
                                                    <Marker position={feature.location} icon={individualsIcon} eventHandlers={{
                                                        click: () => { setCoord(feature.location) },
                                                    }}>
                                                        <Popup>
                                                            <h3>Name: {feature.event_name}</h3>
                                                            <p>Date: {feature.date}</p>
                                                            {/* <p>Type: {feature.type}</p> */}
                                                            <p>Location: {JSON.stringify(feature.location)}</p>
                                                            {/* <PersonSearchIcon className='DetailsIcon' onClick={(e) => navigate(`/details/${entityConnect}`)}/> */}
                                                        </Popup>
                                                    </Marker>
                                                )},
                                            </MarkerClusterGroup>
                                        </LayerGroup>
                                    </LayersControl.Overlay>

                                </LayersControl>
                                {(modeValue ? <MultipleConnections render={render} targetValue1={targetValue1} targetValue2={targetValue2} targetValue3={targetValue3} targetValue4={targetValue4} targetValue5={targetValue5} /> : console.log('no connections for multiple'))}
                                {(poly ? <Connections details={detailsSelect} /> : console.log('no connections'))}
                                {(eventpoly ? <EventConnections details={detailsSelect} /> : console.log('no connections'))}
                                {(Orgpoly ? <OrgConnections details={detailsSelect} /> : console.log('no connections'))}
                                {(targetValue !== '' || searchSet === true ?
                                    <Circle color='blue' fillColor='yellow' weight={2} opacity={.9} center={coord} radius={8000} />
                                    :
                                    console.log('')
                                )}
                                <MapController coord={coord} />
                                <ScaleControl position='topleft' />
                            </MapContainer>
                        </div>
                    </div>
                </div>
            </div>
            <DetailsPage
                open={open}
                onClose={handleCloseDetailsDialog}
                id={entityConnect}
            />
            <GraphDialog open={analyzeDialogOpen} onClose={handleAnalyzeDialogClose} />

        </>
    );
}

export default Map;