import { 
    Dialog, Box, Typography, FormControl, 
    FormLabel, RadioGroup, FormControlLabel, 
    Radio, TextField, Button, Autocomplete, Stack, 
    Divider, TextareaAutosize, DialogContent, DialogTitle
} from '@mui/material';
import { useState, useEffect } from 'react';
 
export default function EntityDialog({ open, onClose }) {
    const [entityName, setEntityName] = useState('');
    const [indOrOrg, setIndOrOrg] = useState(true);
    const [narrative, setNarrative] = useState('');
    const [events, setEvents] = useState([]);
    const [eventOptions, setEventOptions] = useState([]);
    const maxCharacters = 500;
    const remainingCharacters = maxCharacters - narrative.length;
    const userInfo = {
      username: 'joe.schmoe.mil@mail.mil',
      user_organization: 'Army-1st_Brigade_82nd_Airborne',
    };
  
    useEffect(() => {
      fetch("http://localhost:3001/events", {
          credentials: "include"
      })
          .then((response) => response.json())
          .then((data) => {
              setEventOptions(data);
          })
          .catch((error) => {
              console.error('Error fetching data:', error);
          });
    }, []);
    function showIndividualFields() {
        // Return the JSX for individual fields here.
        return <Typography>Individual Fields</Typography>;
      }
      
    function showOrganizationFields() {
        // Return the JSX for organization fields here.
        return <Typography>Organization Fields</Typography>;
      }
    const handleSubmit = async () => {
      // Mocked values, integrate with your actual state.
      const phonenumber = ''; 
      const lat = '';
      const long = '';
      const orgType = '';
      const image = '';
      const eventType = '';
  
      await fetch("http://localhost:3001/entity", {
          credentials: "include",
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              user_id: 1,
              indOrOrg: indOrOrg,
              date: new Date(),
              organization: entityName,
              narrative: narrative,
              events: events,
              phonenumber: phonenumber,
              location: [Number(lat), Number(long)],
              orgType: orgType,
              eventType: eventType,
              image: image,
          })
      });
    };
    
    return (
        <Dialog
          open={open}
          onClose={onClose}
          fullWidth={true}
          maxWidth="lg"
        >
          <DialogTitle>Create an Entity</DialogTitle>
    
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography variant="h6">User Information</Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography>Username: {userInfo.username}</Typography>
                <Typography>User Organization: {userInfo.user_organization}</Typography>
              </Box>
    
              <Divider />
    
              <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="h6">Individual/Organization</Typography>
    
                <FormControl component="fieldset">
                  <FormLabel component="legend">Entity Type</FormLabel>
                  <RadioGroup row name="row-radio-buttons-group">
                    <FormControlLabel value={true} control={<Radio />} label="Individual" onClick={() => setIndOrOrg(true)} />
                    <FormControlLabel value={false} control={<Radio />} label="Organization" onClick={() => setIndOrOrg(false)} />
                  </RadioGroup>
                </FormControl>
    
                <TextField
                  margin='dense'
                  label="Entity Name"
                  value={entityName}
                  onChange={(event) => setEntityName(event.target.value)}
                />
    
                {/* Assuming these functions return JSX elements */}
                {(indOrOrg === true ? showIndividualFields() : showOrganizationFields())}
              </Box>
    
              <Stack spacing={2} width={'100%'}>
                <Box>
                  <Typography variant="h6">Event</Typography>
                  <Autocomplete
                    disablePortal
                    id="event-autocomplete"
                    options={eventOptions}
                    freeSolo
                    onChange={(event, newValue) => setEvents(newValue)}
                    onInputChange={(e) => setEvents(e.target.value)}
                    renderInput={(params) => <TextField {...params} label="Select an Event" />}
                  />
                </Box>
              </Stack>
    
              <Divider />
    
              <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="h6">Narrative:</Typography>
                <TextareaAutosize 
                  minRows={5} 
                  style={{ width: '100%' }} 
                  onChange={(e) => setNarrative(e.target.value)} 
                  maxLength={maxCharacters} 
                />
                <Typography>{remainingCharacters}/{maxCharacters}</Typography>
              </Box>
    
              <Button onClick={handleSubmit} variant="contained">
                Save
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      );
  }