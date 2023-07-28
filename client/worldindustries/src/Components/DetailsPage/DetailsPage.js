import './DetailsPage.css';
import { Container, Grid, Typography, Stack, Button, Chip, TextField, MenuItem, Box, Popper} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CancelIcon from '@mui/icons-material/Cancel';
import * as MyFunctions from './DetailsFunctions.js';

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
  const [ events, setEvents ] = useState([])
  const [ associateToAdd, setAssociateToAdd ] = useState({
    weight: 1,
    id_entity_1: parseInt(id),
    id_entity_2: 0,
    id_event: 1
  })

  useEffect(() => {
    fetch(`https://localhost:3001/relationships/${id}`)
      .then(res => res.json())
      .then(data => {setAssociates(data)})
  }, [id])

  useEffect(() => {
    fetch(`https://localhost:3001/events`)
      .then(res => res.json())
      .then(data => {setEvents(data)})
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
  }, [id])

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
  }, [id])

  useEffect(() => {
    fetch(`https://localhost:3001/biography/${id}`)
      .then(res => res.json())
      .then(data => setBiography(data))
  }, [id])

  const handleClickAssociate = (id) => {
    console.log(id);
  }

  const handleDeleteAssociate = (entity2) => {
    let obj = {
      "id_entity_1": parseInt(id),
      "id_entity_2": entity2
    }
    let init = {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    }
    fetch('https://localhost:3001/interaction', init)
      .then(res => res.json())
      .then(data => {alert(data.message); window.location.reload()})
  }

  const handleAddAssociate = () => {
    setAddAssociateToggle(!addAssociateToggle)
  }

  const handleChangeForFormEntity = (e) => {
    console.log(e.target.value)
    fetch(`https://localhost:3001/entity/${e.target.value}`)
      .then(res => res.json())
      .then(data => {
        let entity2 = data[0].primary_entity_id;
        let obj = {...associateToAdd}
        obj.id_entity_2 = entity2
        setAssociateToAdd(obj)
        // console.log(obj)
      })
  }

  const handleChangeForFormEvent = (e) => {
    let event = e.target.value
    console.log(event)
    let obj = {...associateToAdd}
    obj.id_event = event.id
    setAssociateToAdd(obj)
    console.log(associateToAdd)
  }

  const handleOnSubmitForm = () => {
    let init = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(associateToAdd)
    }
    fetch('https://localhost:3001/interaction', init)
      .then(res => res.json)
      .then(data => console.log(data))
  }

  return (
    <Container maxWidth='xl' className='details-page-container bg-jet'>
      {MyFunctions.renderAssociateForm(addAssociateToggle, handleOnSubmitForm, handleChangeForFormEntity, handleChangeForFormEvent, everyone, events, setAddAssociateToggle)}
      <Grid container>
        <Grid container item xs={6}>
          <Grid item xs={5} className='details-item-container'>
            <img src={placeholderImg} alt="user" className='details-image' />
          </Grid>
          <Grid item xs={7} className='details-item-container'>
            <Box className='data-box'>
              <Typography variant='h4' gutterBottom>
                User Profile
              </Typography>
              <Stack direction='row' spacing={1} useFlexGap flexWrap={'wrap'}>
                {MyFunctions.returnBiography(biography)}
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} className='details-item-container'>
            <Box className='data-box'>
              <Stack direction='row' justifyContent='space-between' alignItems={'center'}>
                <Typography variant='h4' gutterBottom>
                  Known Associates
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddCircleIcon />}
                  onClick={() => handleAddAssociate()}
                  className='rounded-button'>
                  Add Associate
                </Button>
              </Stack>
              <Stack direction='row' spacing={1} useFlexGap flexWrap={'wrap'}>
                {MyFunctions.returnChipsForAssociates(associates, handleClickAssociate, handleDeleteAssociate)}
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} className='details-item-container'>
            <Box className='data-box'>
              <Typography variant='h4' gutterBottom>
                  Events
              </Typography>
              <Stack direction='row' spacing={1} useFlexGap flexWrap={'wrap'}>
                {MyFunctions.returnEvents(entity)}
              </Stack>
            </Box>
          </Grid>
        </Grid>
        <Grid container item xs={6}>
          <Grid item xs={12} className='details-item-container'>
            <Box className='data-box'>
            <Stack direction='row' justifyContent='space-between' alignItems={'center'}>
                <Typography variant='h4' gutterBottom>
                  Narratives
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddCircleIcon />}
                  className='rounded-button'>
                  Add narrative
                </Button>
              </Stack>
              <Typography variant='body1' gutterBottom>
              </Typography>
                {MyFunctions.returnNarratives(narratives)}
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default DetailsPage;

