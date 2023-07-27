import { Box } from "@mui/material";

const AddAssociateForm = () => {

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('submitted');
  }

  return (
    <Box component='form' onSubmit={handleSubmit}>
      Add Associate Form Placeholder
    </Box>
  )
}

export default AddAssociateForm;