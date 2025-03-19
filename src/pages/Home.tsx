import { Box, Button, Typography } from "@mui/material";
import back from "../assets/Images/happy-doctor-holding-clipboard-with-patients.jpg";

const Home = () => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundImage: `url(${back})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "top",
        display: "flex",
        alignItems: "center",
        justifyContent: { xs: "center", md: "flex-end" }, // Center on small screens, right on large
      }}
    >
      <Box
        sx={{
          width: { xs: "90%", sm: "80%", md: "420px" }, // Dynamic width
          padding: { xs: "20px", sm: "30px" },
          backgroundColor: "#F4F9FC",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          mr:15
        }}
      >
        <Typography
          sx={{
            fontFamily: "Convergence",
            fontWeight: 900,
            fontSize: { xs: "18px", sm: "20px" }, // Adjust size for small screens
            color: "#000000",
            marginBottom: "8px",
          }}
        >
          Painless, <span style={{ color: "#3CBDED" }}>Safe</span> Treatment
        </Typography>

        <Typography
          sx={{
            fontFamily: "Convergence",
            fontWeight: 900,
            fontSize: { xs: "32px", sm: "38px", md: "42px" }, // Responsive text size
            lineHeight: { xs: "36px", sm: "40px", md: "42px" }, // Adjust spacing dynamically
            color: "#000000",
            marginBottom: "15px",
          }}
        >
          Hear what you have been,<br />
          <span style={{ color: "#3CBDED" }}>Missing</span>
        </Typography>

        <Button
          sx={{
            backgroundColor: "#000000",
            color: "#ffffff",
            fontWeight: "bold",
            fontSize: { xs: "12px", sm: "14px" }, // Adjust button size
            padding: { xs: "8px 16px", sm: "10px 20px" },
            borderRadius: "6px",
            textTransform: "none",
            transition: "0.3s",
            "&:hover": { backgroundColor: "#333333" },
          }}
        >
          Make an Appointment
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
