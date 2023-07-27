import { useState } from 'react';
import { Container, Grid, Typography, Stack, Button, Chip, Popper, Box, Card} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddAssociateForm from './AddAssociateForm';
import TextField from '@mui/icons-material/AddCircle';
import './DetailsPage.css';

// const dummyAssociates = {

// }

const placeholderImg = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80';
const placeholderMap = 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1750&q=80';

const DetailsPage = () => {

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClickAssociate = () => {
    console.log('clicked associate');
  }

  const handleDeleteAssociate = () => {
    console.log('deleted associate');
  }

  const handleClickAddAssociate = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  const card = () => {
    fetch(" ") 
  //     .then((response) => response.json())
  //     .then(data => setUserData(data))
   }

  return (
    <Container maxWidth='xl' className='details-page-container'>
      <Grid container>
        <Grid container item xs={6}>
          <Grid item xs={5} className='details-item-container'>
            <img src={placeholderImg} alt="user" className='details-image' />
          </Grid>
          <Grid item xs={7} className='details-page-container'>
               <Card sx={{ maxHeight: 50 }}>
                  <h2>User Profile</h2> 
               </Card> 
                     <p> name </p>
                     <p> phone number </p>
                     <p> location </p>   
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
                onClick={handleClickAddAssociate}
                className='rounded-button'>
                Add Associate
              </Button>
              <Popper id={id} open={open} anchorEl={anchorEl}>
                <AddAssociateForm />
              </Popper>
            </Stack>
            <Stack direction='row' spacing={1} useFlexGap flexWrap={'wrap'}>
              <Chip
                label="Associate Name"
                onClick={handleClickAssociate}
                onDelete={handleDeleteAssociate}
              />
              <Chip
                label="Associate Name"
                onClick={handleClickAssociate}
                onDelete={handleDeleteAssociate}
              />
              ...
            </Stack>
          </Grid>
          <Grid item xs={12} className='details-item-container'>
            Events
          </Grid>
          <Grid item xs={12} className='details-item-container'>
            <Typography variant='h4' gutterBottom>
              Narrative
            </Typography>
            <Typography variant='body1' gutterBottom>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Aliquam vestibulum morbi blandit cursus risus. Quisque egestas diam
              in arcu cursus euismod quis viverra. Morbi enim nunc faucibus a
              pellentesque sit amet. Vestibulum lorem sed risus ultricies tristique
              nulla aliquet enim. Gravida in fermentum et sollicitudin ac orci.
              <br/><br/>
              In vitae turpis massa sed elementum tempus egestas sed sed. Pulvinar
              mattis nunc sed blandit. Hac habitasse platea dictumst quisque sagittis
              purus sit amet. Arcu non odio euismod lacinia at quis risus sed vulputate.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default DetailsPage;