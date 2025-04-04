import { Box } from '@mui/material'
import AppoinmentContainer from '../containers/AppoinmentContainer'


const Appoinment = () => {
  return (
    <Box
    maxWidth={"1500px"}
    margin="auto"
    minHeight={500}
    padding={2}
    sx={{
      borderRadius: "8px",
      padding: "16px",
      mt: 5,
    }}>
        <AppoinmentContainer/>
    </Box>
  )
}

export default Appoinment