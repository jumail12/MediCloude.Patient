import { Box } from "@mui/material";
import AppoinmentByIdContainer from "../containers/AppoinmentByIdContainer";

const AppoinmentById = () => {
  return (
    <Box
    maxWidth={"1500px"}
    margin="auto"
    minHeight={500}
    padding={2}
    sx={{
      borderRadius: "8px",
      padding: "16px",
  
    }}>
      <AppoinmentByIdContainer />
    </Box>
  );
};

export default AppoinmentById;
