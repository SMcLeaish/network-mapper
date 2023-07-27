import './DetailsPage.css';
import { Container, Grid, Typography, Stack, Button, Chip, TextField, MenuItem } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


const placeholderImg = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80';
const placeholderMap = 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1750&q=80';

const DetailsPage = () => {
  let { id } = useParams();
  const [ associates, setAssociates ] = useState([])
  const [ narratives, setNarratives ] = useState([])
  const [ entity, setEntity ] = useState([])
  const [ biography, setBiography ] = useState([])
  const [ addAssociateToggle, setAddAssociateToggle ] = useState(false)
  const [ everyone, setEveryone ] = useState([])

  useEffect(() => {
    fetch(`https://localhost:3001/relationships/${id}`)
      .then(res => res.json())
      .then(data => {setAssociates(data)})
  }, [])

  useEffect(() => {
    let allData = []
    fetch(`https://localhost:3001/individuals`)
      .then(res => res.json())
      .then(data => data.forEach(e => allData.push(e)))
      .then(() => {
        fetch(`https://localhost:3001/organizations`)
          .then(res => res.json())
          .then(data => {
            data.forEach(e => allData.push(e))
            setEveryone(allData)
          })
      })
    
  }, [])

  useEffect(() => {
    let narrativesToAdd = []
    fetch(`https://localhost:3001/narratives/${id}`)
      .then(res => res.json())
      .then(data => {
        narrativesToAdd = data.filter(e => e.id_entity === parseInt(id))
        setNarratives(narrativesToAdd)
      })
  }, [])

  useEffect(() => {
    fetch(`https://localhost:3001/entity/id/${id}`)
      .then(res => res.json())
      .then(data => {
        fetch(`https://localhost:3001/entity/${data[0].name}`)
          .then(res => res.json())
          .then(data => {
            setEntity(data)
          })
      })
  }, [])

  useEffect(() => {
    fetch(`https://localhost:3001/biography/${id}`)
      .then(res => res.json())
      .then(data => setBiography(data))
  }, [])

  const handleClickAssociate = () => {
    console.log(everyone);
  }

  const handleDeleteAssociate = () => {
    console.log('deleted associate');
  }

  const handleAddAssociate = () => {
    console.log(addAssociateToggle);
    setAddAssociateToggle(!addAssociateToggle)
  }

  const returnChipsForAssociates = (data) => {
    return data.map((e) => {
      return (
        <Chip key={e.entity_id}
            label={e.name}
            onClick={handleClickAssociate}
            onDelete={handleDeleteAssociate}
        />
      )
    })
  }

  const returnNarratives = (data) => {
    return data.map((e) => {
      return (
        <Chip key={e.id}
            label={e.narrative_string}
        />
      )
    })
  }

  const returnEvents = (data) => {
    let events = data.map(e => e.event_name)
    let unique = [...new Set(events)]
    return unique.map((e) => {
        return (
          <Chip key={e}
              label={e}
          />
        )
    })
  }

  const returnBiography = (data) => {
    if(data.length > 0) {
      let bio = data[0]
      if (bio.individual_id) {
        return (
        <div>
          <Chip key={bio.individual_name}
              label={`Name: ${bio.individual_name}`}
          />
          <Chip key={bio.position_id}
              label={`Works for ${bio.org_name}`}
          />
        </div>
        )
      } else {
        return (
          <div>
          <Chip key={bio.individual_name}
              label={`Organization name: ${bio.name}`}
          />
          <Chip key={bio.position_id}
              label={`Organization type: ${bio.type}`}
          />
          </div>
        )
      }
    }
  }

  const renderAssociateForm = (check) => {
    if (check) {
      return (
        <div className='associate_form_container'>
          <form className='associate-form'>
            <TextField
              id="outlined-select"
              select
              label="Select"
              helperText="Please select your associate"
              defaultValue=''
              onChange={(e) => console.log(e.target.value)}
            >
                {everyone.map(person => (
                  <MenuItem key={person.name} value={person.name}>
                    {person.name}
                  </MenuItem>
                ))}
            </TextField>
            <Button
                  variant="outlined"
                  startIcon={<AddCircleIcon />}
                  className='rounded-button'
                  onClick={() => console.log()}
                  >
                  Add Associate
            </Button>
          </form>
        </div>
      )
    }
  }

  return (
      <Container maxWidth='xl' className='details-page-container'>
        {renderAssociateForm(addAssociateToggle)}
        <Grid container>
          <Grid container item xs={6}>
            <Grid item xs={5} className='details-item-container'>
              <img src={placeholderImg} alt="user" className='details-image' />
            </Grid>
            <Grid item xs={7} className='details-item-container'>
                <Typography variant='h4' gutterBottom>
                  Biography
                </Typography>
                {returnBiography(biography)}
            </Grid>
            <Grid item xs={12} className='details-item-container'>
              <img src={placeholderMap} alt="map" className='details-image' />
            </Grid>
          </Grid>
          <Grid container item xs={6}>
            <Grid item xs={12} className='details-item-container'>
              <Stack direction='row' justifyContent='space-between' alignItems={'center'}>
                <Typography variant='h4' gutterBottom>
                  Known Associates
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddCircleIcon />}
                  onClick={handleAddAssociate}
                  className='rounded-button'>
                  Add Associate
                </Button>
              </Stack>
              <Stack direction='row' spacing={1} useFlexGap flexWrap={'wrap'}>
                {returnChipsForAssociates(associates)}
              </Stack>
            </Grid>
            <Grid item xs={12} className='details-item-container'>
                <Typography variant='h4' gutterBottom>
                  Events
                </Typography>
                {returnEvents(entity)}
            </Grid>
            <Grid item xs={12} className='details-item-container'>
                <Typography variant='h4' gutterBottom>
                  Narratives
                </Typography>
              {returnNarratives(narratives)}
            </Grid>
          </Grid>
        </Grid>
      </Container>
  );
}

export default DetailsPage;