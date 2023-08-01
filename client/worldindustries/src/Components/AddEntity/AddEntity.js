import { useState, useEffect } from 'react';
import './AddEntity.css';
import { styled, TextField, Box, Button, Container, Grid, Paper, AutoComplete } from '@mui/material';

//  ADD ENTITY - PARENT FUNCTION
const AddEntity = () => {
    const [profilePicture, setProfilePicture] = useState(null);
    const [narrative, setNarrative] = useState('');
    const [organization, setOrganization] = useState('');
    const [association, setAssociation] = useState('');
    const [events, setEvents] = useState('');
    const [name, setName] = useState('')
    const [option, setOption] = useState([]);

    //  UPLOAD PHOTO - CHILD FUNCTION
    const profilePictureUpload = (event) => {
        const file = event.target.files[0];
        setProfilePicture(file);
    };

    //  SET NAME - CHILD FUNCTION
    const SettingName = () => {
        useEffect(() => {
            fetch('http://localhost:8080/name/')
                .then(response => response.json())
                .then(data => setName(data))
                .catch(error => console.log(error));
        }, []);

        return (
            <div>
                <h3>
                    Name
                </h3>
                <p>
                    {name}
                </p>
            </div>
        );
    };

    const AutoComplete = () => {
        useEffect(() => {
            fetch(" ")
                .then((response) => response.json())
                .then((data) => {
                    setOption(data);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }, []);
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
    
    return (
        <div>
            <header>
                <h1>
                    Add Entity
                </h1>
            </header>
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
                <input type='file' accept='image/*' onChange={profilePictureUpload} />
            </div>
            <div>
                <SettingName />
            </div>
            <div>
                <h3>
                    Organization:
                </h3>
                <input type='text' value={organization} onChange={settingOrganization} />
            </div>
            <Container maxWidth="lg">
                <h3> Association </h3>
                <AutoComplete
                    option={option}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                        <TextField {...params} label="Select a option"
                            classname="auto-complete" />
                    )}
                />
            </Container>
            <div>
                <input type='text' value={association} onChange={settingAssociation} />
            </div>
            <div>
                <h3> Events </h3>
                <Grid item xs={7} className='details-item-container'>
                    <Box className='events-box'>
                    </Box>
                </Grid>
                <input type='text' value={events} onChange={settingEvents} />
            </div>
            <div>
                <h3>
                    Narrative:
                </h3>
                <SettingNarrative />
            </div>
            <Button onClick={AddEntity} class="mdc-button mdc-button-outlined">
                <span class="mdc-button__label">Outlined Button </span>
                Save
            </Button>
        </div>
    );
};

export default AddEntity;
