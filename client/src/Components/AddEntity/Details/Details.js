
import { useNavigate, useLocation, useParams } from 'react-router-dom'



function Details() {
    const navigate = useNavigate()
    const details = useLocation().state;

  
    return (
        <>
        <h1> the following was passed to Details folder </h1>
        <p> {details} </p>
        <button onClick={() => navigate(`/map`)} >Back to Map</button>

        </>
    
    );
  }
  

  export default Details;
 
