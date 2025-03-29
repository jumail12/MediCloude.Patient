import { Box, Typography } from "@mui/material";
import image from "../assets/Images/whoweare.jpg";

const WhoWeArePage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1850px",
        height: "900px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "800px",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // Side by side on large screens
          overflow: "hidden",
        }}
      >
        {/* Left Section: Image */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            height: "800px",
            backgroundImage: `url(${image})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        
        {/* Right Section: Text */}
        <Box
          sx={{
            flexGrow: 1,
            width: { xs: "100%", md: "50%" },
            padding: "40px",
            textAlign: "center", // Centers the text
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Heading with Color Styling */}
          <Typography
            variant="h3"
            sx={{
              fontSize: "36px",
              fontWeight: "800",
              fontFamily: "ConcertOne",
            }}
          >
            <span style={{ color: "#3CBDED" }}>WHO</span>{" "}
            <span style={{ color: "black" }}>we are</span>
          </Typography>

          {/* Paragraph with Styled "MEDICLOUDE" */}
          <Typography
            sx={{
              fontWeight: "500",
              fontFamily: "Convergence",
              fontSize: "18px",
              lineHeight: "1.6",
              color: "black",
              marginTop: "20px",
              maxWidth: "90%",
            }}
          >
            <span style={{ color: "#3CBDED", fontWeight: "bold" }}>MEDI</span>
            <span style={{ color: "black", fontWeight: "bold" }}>CLOUDE</span> is a comprehensive online patient management system
            designed to simplify healthcare access. Patients can effortlessly
            book appointments, receive prescriptions, and consult doctors both
            online and in person. For healthcare professionals,{" "}
            <span style={{ color: "#3CBDED", fontWeight: "bold" }}>MEDI</span>
            <span style={{ color: "black", fontWeight: "bold" }}>CLOUDE</span>{" "}
            streamlines operations—doctors can efficiently manage patient
            records and reports, while administrators oversee workflows to
            ensure a smooth and seamless healthcare experience. With an
            intuitive interface and secure data management,{" "}
            <span style={{ color: "#3CBDED", fontWeight: "bold" }}>MEDI</span>
            <span style={{ color: "black", fontWeight: "bold" }}>CLOUDE</span>{" "}
            enhances patient care by bridging the gap between patients, doctors,
            and healthcare facilities, making quality healthcare more accessible
            than ever.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default WhoWeArePage;
