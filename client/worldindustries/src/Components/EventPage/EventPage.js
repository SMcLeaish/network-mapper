import { Dialog, Container, Grid, Typography, Stack, Button, Box } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useEffect, useState } from 'react';
import * as MyFunctions from './EventPageFunctions.js';
import { useParams } from 'react-router-dom';
import '../DetailsPage/DetailsPage.css';

const placeholderImg = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80';

const EventPage = () => {
    let { id } = useParams();
    const [ event, setEvent ] = useState([])
    const [ narratives, setNarratives ] = useState([])
    const [ entityList, setEntityList ] = useState([])
    const [ checkForAttendie, setCheckForAttendie ] = useState(false)
    const [ checkForNarr, setCheckForNarr ] = useState(false)
    const [ attendieToAdd, setAttendieToAdd ] = useState({
        weight: 1,
        id_entity_1: 0,
        id_entity_2: 0,
        id_event: parseInt(id)
    })
    const [ narrToAdd, setNarrToAdd ] = useState({
        date: '',
        narrative_string: '',
        id_event: parseInt(id)
    })
    const [updateStatus, setUpdateStatus] = useState(true)

    useEffect(() => {
        fetch(`http://localhost:3001/event/${id}`)
            .then(res => res.json())
            .then(data => setEvent(data))
    }, [id, updateStatus])

    useEffect(() => {
        fetch(`http://localhost:3001/narratives/event/${id}`)
            .then(res => res.json())
            .then(data => { setNarratives(data); console.log(data) })
    }, [id, updateStatus])

    useEffect(() => {
        let allData = []
        fetch(`http://localhost:3001/individuals`)
            .then(res => res.json())
            .then(data => data.forEach(e => allData.push(e)))
            .then(() => {
                fetch(`http://localhost:3001/organizations`)
                    .then(res => res.json())
                    .then(data => {
                        data.forEach(e => allData.push(e))
                        setEntityList(allData)
                    })
            })
    }, []);



    return (
        <Container maxWidth='xl' className='details-page-container bg-jet'>
            {MyFunctions.renderAttendieForm(checkForAttendie, entityList, setCheckForAttendie, attendieToAdd, setAttendieToAdd, setUpdateStatus, updateStatus)}
            {MyFunctions.renderNarrativeForm(checkForNarr, setCheckForNarr, narrToAdd, setNarrToAdd, setUpdateStatus, updateStatus)}
            <Grid container>
                <Grid container item xs={6}>
                    <Grid item xs={5} className='details-item-container'>
                        <img src={placeholderImg} alt="user" className='details-image' />
                    </Grid>
                    <Grid item xs={7} className='details-item-container'>
                        <Box className='data-box'>
                            <Typography variant='h4' gutterBottom>
                                Event Details
                            </Typography>
                            <Stack direction='row' spacing={1} useFlexGap flexWrap={'wrap'}>
                                {MyFunctions.returnEventDetails(event)}
                            </Stack>
                        </Box>
                    </Grid>
                    <Grid item xs={12} className='details-item-container'>
                        <Box className='data-box'>
                            <Stack direction='row' justifyContent='space-between' alignItems={'center'}>
                                <Typography variant='h4' gutterBottom>
                                    Attendies
                                </Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<AddCircleIcon />}
                                    className='rounded-button'
                                    onClick={() => setCheckForAttendie(!checkForAttendie)}>
                                    Add Attendie
                                </Button>
                            </Stack>
                            <Stack direction='row' spacing={1} useFlexGap flexWrap={'wrap'}>
                                {MyFunctions.returnAttendies(event)}
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
                                    onClick={() => setCheckForNarr(!checkForNarr)}
                                >
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
    )
}

export default EventPage;