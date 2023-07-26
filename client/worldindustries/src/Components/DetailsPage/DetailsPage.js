import './DetailsPage.css';
import { Container, Grid, Typography, Stack, Button, Chip } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

// const dummyAssociates = {

// }

const placeholderImg = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80';
const placeholderMap = 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1750&q=80';

const DetailsPage = () => {

  const handleClickAssociate = () => {
    console.log('clicked associate');
  }

  const handleDeleteAssociate = () => {
    console.log('deleted associate');
  }

  const handleAddAssociate = () => {
    console.log('added associate');
  }

  return (
      <Container maxWidth='xl' className='details-page-container'>
        <Grid container>
          <Grid container item xs={6}>
            <Grid item xs={5} className='details-item-container'>
              <img src={placeholderImg} alt="user" className='details-image' />
            </Grid>
            <Grid item xs={7} className='details-item-container'>
              Employer + Address + etc
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
              Narrative
            </Grid>
          </Grid>
        </Grid>
      </Container>
  );
}

export default DetailsPage;