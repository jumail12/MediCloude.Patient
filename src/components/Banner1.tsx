import { Box, Typography, Button } from "@mui/material";
import bannerimage from "../assets/Images/bannerimg.jpg";

const Banner1 = () => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1700px",
        height: "200px",
        backgroundColor: "black",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        position:"relative",
        left:60,
        mb:5,
        gap: "30px", // Ensures proper spacing between image and text
      }}
    >
      {/* Left Side - Centered Image */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center", // Centers image vertically
          justifyContent: "center", // Ensures it's properly placed
        }}
      >
        <Box
          component="img"
          src={bannerimage}
          alt="Doctor Consultation"
          sx={{
            width: "130px", // Slightly larger for better visibility
            height: "130px",
            borderRadius: "10px",
            objectFit: "contain",
          }}
        />
      </Box>

      {/* Right Side - Centered Text and Button */}
      <Box
        sx={{
          color: "white",
          textAlign: "center",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "22px", md: "26px" },
            fontWeight: "bold",
          }}
        >
          Consult top doctors online for any health concern
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "16px", md: "18px" },
            opacity: 0.8,
            marginTop: "5px",
          }}
        >
          Connect within 60s
        </Typography>

        {/* Signup Button */}
        <Button
          variant="contained"
          sx={{
            marginTop: "15px",
            backgroundColor: "white",
            color: "black",
            fontWeight: "bold",
            fontSize: "16px",
            padding: "10px 25px",
            alignSelf: "center",
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
        >
          Signup Now
        </Button>
      </Box>
    </Box>
  );
};

export default Banner1;
