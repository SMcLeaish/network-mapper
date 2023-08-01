import { useState, useEffect } from 'react';
import './AddEntity.css';
import { styled, TextField, Box, Button, Container, Grid, Paper, AutoComplete, Typography } from '@mui/material';

//  ADD ENTITY - PARENT FUNCTION
const AddEntity = () => {
    const [profilePicture, setProfilePicture] = useState(null);
    const [narrative, setNarrative] = useState('');
    const [organization, setOrganization] = useState('');
    const [association, setAssociation] = useState('');
    const [events, setEvents] = useState('');
    // const [name, setName] = useState('')
    const [option, setOption] = useState([]);
    // const [users, setUsers] = useState([]);
    const [orgId, setOrgId] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);

    

    // LOGGED-IN USER INFORMATION
    // useEffect(() => {
    //     fetch('http://localhost:3001/get-logged-in-user', {
    //         method: 'GET',
    //         credentials: 'include',
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         setLoggedInUser(data.user);
    //     })
    //     .catch(error => console.log(error));
    // }, []);

    //  UPLOAD PHOTO - CHILD FUNCTION
    // const profilePictureUpload = (event) => {
    //     const file = event.target.files[0];
    //     setProfilePicture(file);
    // };

    //  SET USER - CHILD FUNCTION
   
    
    const AutoComplete = () => {
        //steal from chris woeller
        // useEffect(() => {
        //     fetch(" ")
        //     .then((response) => response.json())
        //     .then((data) => {
        //         setOption(data);
        //     })
        //     .catch((error) => {
        //     console.error('Error fetching data:', error);
        // });
        // },[]);
    };

    //  SET ORGANIZATION - CHILD FUNCTION
    const settingOrganization = (event) => {
        const { value } = event.target;
        setOrganization(value);
    };

    //  SET ASSOCIATION - CHILD FUNCTION
    const settingAssociation = (event) => {
        const { value } = event.target;
        setAssociation(value);
    };

    //  SET EVENTS - CHILD FUNCTION
    const settingEvents = (event) => {
        const { value } = event.target;
        setEvents(value);
    };

    //  SET NARRATIVE - CHILD FUNCTION
    const SettingNarrative = () => {
        
        //  NARRATIVE UPDATE - GRANDCHILD FUNCTION
        const narrativeUpdate = (event) => {
            const { value } = event.target;
            setNarrative(value);
        };
        const maxCharacters = 500;
        const remainingCharacters = maxCharacters - narrative.length;
        
            return (
            <div>
                <textarea value={narrative} onChange={narrativeUpdate} maxLength={maxCharacters} />
                <div>
                    {remainingCharacters}/{maxCharacters}
                </div>
            </div>
        )
    }
    
    const handleSubmit=()=>{
        console.log(association,organization,events,narrative)
        fetch("https://localhost:3001/entity",{
            credentials:'include',
            headers:{ 'Content-Type': 'application/json'},
            method:'POST',
            body:JSON.stringify({
                association:association,
                organization:organization,
                events:events,
                narrative:narrative
            })
        }).then(res=>res.json())
        
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
                    <div>
                        <h3>
                            Logged-in User Information:
                        </h3>
                        {loggedInUser ? (
                            <div>
                                <p>
                                    Username: {loggedInUser.username}
                                </p>
                                <p>
                                    User Organization: {loggedInUser.user_organization}
                                </p>
                            </div>
                        ) : (
                            <p>
                                Loading user information...
                            </p>
                        )}
                    </div>
                    <div>
                   
                    </div>
                    <div>
                        <h3>
                            Organization:
                        </h3>
                        <input type='text' value={organization} onChange={settingOrganization} />
                    </div>    
                    <Box maxWidth="500px" maxclassName='association-box'>
                        <h3>
                            Association:
                        </h3> 
                        {/* { <AutoComplete
                            option={option} 
                            getOptionLabel={(option) => option.label}
                            renderInput={(params) => ( 
                            <TextField {...params} label="Select a option" 
                            classname="auto-complete" />
                        )}
                        /> */}
                        <div> 
                            <input type='text' value={association} onChange={settingAssociation} />
                            
                        </div>
                    </Box>
                    <Grid item xs={7} className='details-item-container'>
                        <h3>
                            Events:
                        </h3>
                            <Box className='events-box'>
                        
                            </Box>
                        <input type='text' value={events} onChange={async (e)=>await setEvents(e.target.value)} />
                    </Grid>

                    <div>
                        <h3>
                            Narrative:
                        </h3>
                        <SettingNarrative />
                    </div>
                    
                    <Button onClick={()=>handleSubmit()} class="save-button">
                        Save
                    </Button>
            
            </Container>
        </div>
    );
};

export default AddEntity;
