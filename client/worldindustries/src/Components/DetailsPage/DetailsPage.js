import './DetailsPage.css';
import { Container, Grid } from '@mui/material';

const DetailsPage = () => {
  return(
      // <div className='details-container'>
      //     <div className='entity-details'>
      //         these are entity details
      //     </div>
      //     <div className='image'>
      //         this is the entity's image
      //     </div>
      //     <div className='map'>
      //         this is the smol map
      //     </div>
      // </div>
      <Container maxWidth='xl' className='details-page-container'>
        <Grid container>
          <Grid container xs={6} className='grid-border'>
            <Grid item xs={5} className='grid-border'>
              Image
            </Grid>
            <Grid item xs={7} className='grid-border'>
              Employer + Address + etc
            </Grid>
            <Grid item xs={12} className='grid-border'>
              Map
            </Grid>
          </Grid>
          <Grid container xs={6} className='grid-border'>
            <Grid item xs={12} className='grid-border'>
              Known Associates
            </Grid>
            <Grid item xs={12} className='grid-border'>
              Events
            </Grid>
            <Grid item xs={12} className='grid-border'>
              Narrative
            </Grid>
          </Grid>
        </Grid>
      </Container>
  )
}

export default DetailsPage;