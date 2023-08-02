import { useState, useEffect } from 'react';
import { styled, TextField, Box, Button, Container, Grid, Paper, Autocomplete, Typography, Stack, FormControl, FormLabel, RadioGroup, Radio } from '@mui/material';
import { FormControlLabel, Checkbox } from '@mui/material';
import './AddEntity.css';
//  ADD ENTITY - PARENT FUNCTION
const AddEntity = () => {
    const [profilePicture, setProfilePicture] = useState(null);
    const [narrative, setNarrative] = useState('');
    const [organization, setOrganization] = useState('');
    const [association, setAssociation] = useState('');
    const [date,setDate]=useState('');
    const [events, setEvents] = useState('');
    // const [name, setName] = useState('')
    const [option, setOption] = useState([]);
    const [eventType,setEventType]=useState('')
    const [orgId, setOrgId] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [indOrOrg,setIndOrOrg]=useState(true);
    const [phonenumber,setPhonenumber]=useState('');
    const [lat, setLat] = useState(0);
    const [long, setLong] = useState(0);
    const [location,setLocation]=useState([]);
    const [entityName, setEntityName] = useState('');
    const [entityType, setEntityType] = useState('');
    const [orgType,setOrgType]=useState("individual");
    // const [userInfo,setUserInfo]=useContext(UserContext)
    
   //ToDO: 10 events <- autocomplete. in case of not at 10 create an event
   // event table in the backend we create it and then link foreing id 
   // individual or organazation  

    const userInfo={
        username: 'joe.schmoe.mil@mail.mil',
        user_organization: 'Army-1st_Brigade_82nd_Airborne',    
    };


    // FETCH association autocomplete options
    // 'https://localhost:3001/individuals'

    
    // const AutoComplete = () => {
    //     // steal from chris woeller
    //  useEffect(() => {
    // fetch("https://localhost:3001/organization",{
    //     credentials:"include"})
    //     .then((response) => response.json())
    //     .then((data) => {
    //        setOption(data);
    //        })
    //        .catch((error) => {
    //         console.error('Error fetching data:', error);
    //     });
    //      },[]);
    // };
     //Updates the selcted organization
    
    const setNewEvents = (event, newValue) => {
        const { value } = event.target;
        setNewEvents(newValue);
    };
    
    
    const handleOrganizationChange = (event, newValue) => {
      setOrganization(newValue);
    };

    //  SET ORGANIZATION - CHILD FUNCTION
    // const settingEvent = (event) => {
    //     const { value } = event.target;
    //     setOrganization(value);
    // };

    //  SET ASSOCIATION - CHILD FUNCTION
    const setNewAssociation = (event, newValue) => {
        const { value } = event.target;
        setAssociation(newValue);
    };

    //  SET EVENTS - CHILD FUNCTION
    const setting = (event) => {
        const { value } = event.target;
        setEvents(value);
    };

    //  SET NARRATIVE - CHILD FUNCTION
    
        
        const maxCharacters = 500;
        const remainingCharacters = maxCharacters - narrative.length;
        
            
    
    
    const handleSubmit=async ()=>{
        console.log("This is your submiited indOrorg",indOrOrg)
        setLocation([Number(lat),Number(long)])
        await fetch("https://localhost:3001/entity",{
            credentials:"include",
            method:"POST",
            headers:{ 'Content-Type': 'application/json' },
            body: JSON.stringify({
                //will update to userInfo.id
            user_id:1,
            indOrOrg:indOrOrg,
            association:association,
            date: new Date(),
            organization:entityName,
            narrative:narrative,
            events:events,
            phonenumber:phonenumber,
            location:location,
            orgType:orgType,
            eventType:eventType

          })
        })
        .then(res=>res.json())
        
    }


    const showIndividualFields = () => {
        return (
            <>
            <TextField
                margin='dense'
                id="outlined-controlled"
                label="Latitude"
                value={lat}
                onChange={(event) => setLat(event.target.value)}
            />
            <TextField
                margin='dense'
                id="outlined-controlled"
                label="Longitude"
                value={long}
                onChange={(event) => setLong(event.target.value)}
            />
            <TextField
                margin='dense'
                id="outlined-controlled"
                label="Phone Number"
                value={phonenumber}
                onChange={(event) => setPhonenumber(event.target.value)}
            />
            </>
        )
    }

    const showOrganizationFields = () => {
        return (
            <>
            <TextField
                margin='dense'
                id="outlined-controlled"
                label="Latitude"
                value={lat}
                onChange={(event) => setLat(event.target.value)}
            />
            <TextField
                margin='dense'
                id="outlined-controlled"
                label="Longitude"
                value={long}
                onChange={(event) => setLong(event.target.value)}
            />
            <TextField
                margin='dense'
                id="outlined-controlled"
                label="Phone Number"
                value={phonenumber}
                onChange={(event) => setPhonenumber(event.target.value)}
            />
            <TextField
                margin='dense'
                id="outlined-controlled"
                label="Organization Type"
                value={orgType}
                onChange={(event) => setOrgType(event.target.value)}
            />
            </>
        )
    }
  
    return (
        <div>
            <header class="entity-header">
               <h1 class="header-title">Create an Entity</h1> 
            </header>

            <Container maxWidth='xl' className='AddEntity-page-container bg-jet'>
            
                
                    <div>
                        <h2>
                            Upload a Profile Picture
                        </h2>
                        {profilePicture ? (
                            <img src={URL.createObjectURL(profilePicture)} alt='ProfilePicture' />
                            ) : (
                            <p>
                                No photo uploaded
                            </p>
                        )}
                        {/* <input type='file' accept='image/*' onChange={profilePictureUpload} /> */}
                    </div>
                    
                    <Box sx={{width: 800}}>
                        <h3>User Information</h3>
                        <div>
                            <p>Username: {userInfo.username}</p>
                            <p>User Organization: {userInfo.user_organization}
                            </p>
                    </div>
                  
                    </Box>
                <hr></hr>
                    {/* {TOdo: if individual checkbox, display phone number, location 
                    orgaanization type} */}
                    <Box sx={{ width: 400}} className="individual-org">
                        <h3>Individual/Organization</h3>
                        
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Entity Type</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                
                                
                            >   
                                <FormControlLabel value={true} control={<Radio />} label="Individual" onClick={() => setIndOrOrg(true)} />
                                <FormControlLabel value={false} control={<Radio />} label="Organization" onClick={() => setIndOrOrg(false)}/>
                            </RadioGroup>
                        </FormControl>

                        <TextField
                            margin='dense'
                            id="outlined-controlled"
                            label="Entity Name"
                            value={entityName}
                            onChange={(event) => setEntityName(event.target.value)}
                        />

                        {/* name, location, phone number, type */}
                        
                        {console.log(indOrOrg)}
                        {(indOrOrg === true ? showIndividualFields() : showOrganizationFields()  )}


                     </Box>
                    
                    
                    <hr></hr>
                   
                    
                    <Box className='association-box'> 
                    
                    <h3>Association</h3> 
                         
                        <Autocomplete 
                            
                            disablePortal
                            id="association-autocomplete"
                            options={['test', 'test2', 'test3']}
                            value={association}
                            renderInput={(params) => <TextField {...params} label="Select an Association"/>}
                            />
                    </Box>

                       <Box className='event-box'>
                          <h3> Event </h3>    
                          
                            <Autocomplete
                            disablePortal
                            id="event-autocomplete"
                            options={['test', 'test2', 'test3']}
                            
                            onChange={(event, newValue) => {
                                setEvents(newValue);
                                
                              }}
                            onInputChange={(e)=>setEvents(e.target.value)}
                            renderInput={(params) => <TextField {...params} label="Select an Event"/>}
                        />
                     </Box>   
                <hr></hr>
                    <div>
                        <h3>
                            Narrative:
                        </h3>
                        <div>
                <textarea className='narrative-textfield' onChange={(e)=>setNarrative(e.target.value)} maxLength={maxCharacters} />
                <div>
                    {remainingCharacters}/{maxCharacters}
                </div>
            </div>
                    </div>
                    
                    <Button onClick={async ()=> await handleSubmit()} class="save-button">
                        Save
                    </Button>
            
            </Container>
        </div>
    );
};

export default AddEntity;
