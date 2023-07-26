import './DetailsPage.css';
import { Container, Grid, Typography, Stack, Button, Chip } from '@mui/material';
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

  useEffect(() => {
    fetch(`https://localhost:3001/relationships/${id}`)
      .then(res => res.json())
      .then(data => {setAssociates(data)})
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
            fetch(`https://localhost:3001/position/${data[0].org_id}`)
              .then(res => res.json())
              .then(data1 => {
                setBiography(data1)
            })
          })
      })
  }, [])

  const handleClickAssociate = () => {
    console.log('clicked associate');
  }

  const handleDeleteAssociate = () => {
    console.log('deleted associate');
  }

  const handleAddAssociate = () => {
    console.log('added associate');
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
    return data.map((e) => {
       return (
        <Chip key={e.interaction_id}
            label={e.event_name}
        />
       )
     })
   }

   const returnBiography = (data) => {
    if(data.length > 0) {
      let bio = data[0]
      return (
       <div>
        <Chip key={bio.position_id}
            label={`Organization: ${bio.org_name}`}
        />
        <Chip key={bio.org_type}
            label={`Organization type: ${bio.org_type}`}
        />
       </div>
      )
    }
   }

  return (
      <Container maxWidth='xl' className='details-page-container'>
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