import './DetailsPage.css';
import { Dialog, Container, Grid, Typography, Stack, Button, Box} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useEffect, useState } from 'react';
import * as MyFunctions from './DetailsFunctions.js';

const placeholderImg = 'httpss://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80';

const DetailsPage = ({ open, onClose, id }) => {
  const [ associates, setAssociates ] = useState([])
  const [ narratives, setNarratives ] = useState([])
  const [ entity, setEntity ] = useState([])
  const [ biography, setBiography ] = useState([])
  const [ addAssociateToggle, setAddAssociateToggle ] = useState(false)
  const [ addNarrToggle, setAddNarrToggle ] = useState(false)
  const [ everyone, setEveryone ] = useState([])
  const [ events, setEvents ] = useState([])
  const [ associateToAdd, setAssociateToAdd ] = useState({
    weight: 1,
    id_entity_1: id,
    id_entity_2: 0,
    id_event: 1
  })
  const [ narrToAdd, setNarrToAdd ] = useState({})

  const [updateStatus, setUpdateStatus] = useState(true)

  useEffect(() => {
    fetch(`https://localhost:3001/relationships/${id}`)
      .then(res => res.json())
      .then(data => {setAssociates(data); setAssociateToAdd({...associateToAdd, id_entity_1: id}); console.log(data)})
  }, [id, updateStatus])



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
    
  }, []);

  useEffect(() => {
    let narrativesToAdd = []
    fetch(`https://localhost:3001/narratives/${id}`)
      .then(res => res.json())
      .then(data => {
        narrativesToAdd = data.filter(e => e.id_entity === parseInt(id))
        setNarratives(narrativesToAdd)
      })
  }, [id, updateStatus])

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
      "id_entity_1": id,
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
      .then(data => {alert(data.message); setUpdateStatus(!updateStatus);})
  }

  const handleAddAssociate = () => {
    setAddAssociateToggle(!addAssociateToggle)
  }

  const handleChangeForFormEntity = (e) => {
    fetch(`https://localhost:3001/entity/${e.target.value}`)
      .then(res => res.json())
      .then(data => {
        let entity2 = data[0].primary_entity_id;
        let obj = {...associateToAdd}
        obj.id_entity_2 = entity2
        setAssociateToAdd(obj)
      })
  }

  const handleChangeForFormEvent = (e) => {
    let event = e.target.value
    let obj = {...associateToAdd}
    obj.id_event = event.id
    setAssociateToAdd(obj)
  }

  const handleOnSubmitForm = (e) => {
    e.preventDefault()
    let init = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(associateToAdd)
    }
    fetch('https://localhost:3001/interaction', init)
      .then(res => res.json())
      .then(data => {console.log(data); setUpdateStatus(!updateStatus)})
  }

  const handleClose = () => {
    onClose();
  };

  const handleNarrChange = (e) => {
    let date = new Date();
    let today = date.toISOString()
    let obj = {
        date: today.slice(0, 10),
        narrative_string: e.target.value,
        id_entity: id
    }
    console.log(obj)
    setNarrToAdd(obj)
}

  const handeNarrSubmit = (e) => {
    e.preventDefault()
    let init = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(narrToAdd)
    }
    fetch('https://localhost:3001/narrative', init)
      .then(res => res.json())
      .then(data => {console.log(data); setUpdateStatus(!updateStatus)})
  }

  const handleDeleteNarr = (e) => {
    let init = {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json'
      },
    }
    fetch(`https://localhost:3001/narrative/${e}`, init)
      .then(res => res.json())
      .then(data => {console.log(data); setUpdateStatus(!updateStatus)})
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='xl'>
      <Container maxWidth='xl' className='details-page-container bg-jet'>
      {MyFunctions.renderAssociateForm(addAssociateToggle, handleOnSubmitForm, handleChangeForFormEntity, handleChangeForFormEvent, everyone, events, setAddAssociateToggle)}
      {MyFunctions.renderNarrativeForm(addNarrToggle, setAddNarrToggle, handleNarrChange, handeNarrSubmit)}
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
                  className='rounded-button'
                  onClick={() => setAddNarrToggle(true)}
                  >
                  Add narrative
                </Button>
              </Stack>
                <Typography variant='body1' gutterBottom>
                </Typography>
                  {MyFunctions.returnNarratives(narratives, handleDeleteNarr)}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Dialog>
  );
}

export default DetailsPage;

