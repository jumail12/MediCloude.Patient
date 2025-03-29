import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Divider,
  Button,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { businessAxios } from "../api/axiosInstance";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/** ✅ Step 1: Define TypeScript Types */
type Doctor = {
  id: string;
  doctor_name: string;
  qualification: string;
  category: string;
  profile: string;
  drfee: number;
  field_experience: number;
};

type DoctorsApiResponse = {
  doctors: Doctor[];
  total_pages: number;
};

const pageSize = 5; 

const GetAllDrsPageContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const nav=useNavigate();
  const token =localStorage.getItem('token');

  const {
    data: drs = { doctors: [], total_pages: 1 },
    isLoading,
    isError,
  } = useQuery<DoctorsApiResponse>({
    queryKey: ["alldrs", currentPage],
    queryFn: async (): Promise<DoctorsApiResponse> => {
      const res = await businessAxios.get(
        `/DoctorView/all?pageNumber=${currentPage}&pageSize=${pageSize}`
      );
      return res.data.data;
    },
  });


  const handlePageChange = (_: any, value: number) => {
    setCurrentPage(value);
  };

  return (
    <Box
      sx={{
        p: 5,
        bgcolor: "#F5F7FA",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        mb={4}
        color="black"
      >
        Find Your Doctor
      </Typography>


      {isLoading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress size={60} />
        </Box>
      )}

      {isError && (
        <Typography color="error" textAlign="center" mt={2}>
          Failed to load doctors. Please try again later.
        </Typography>
      )}


      {!isLoading && !isError && drs?.doctors?.length > 0 && (
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          {drs.doctors.map((doctor: Doctor) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={doctor.id}
              display="flex"
              justifyContent="center"
            >
              <Card
                sx={{
                  bgcolor: "white",
                  color: "black",
                  borderRadius: 2,
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                  p: 2,
                  transition: "0.3s",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: 350,
                  height: 350,
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <Avatar
                  src={doctor.profile}
                  alt={doctor.doctor_name}
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 1,
                    border: "3px solid black",
                  }}
                />
                <CardContent sx={{ textAlign: "center", width: "100%" }}>
                  <Typography variant="h6" fontWeight="bold" color="black">
                    {doctor.doctor_name}
                  </Typography>

                  <Typography
                    sx={{
                      bgcolor: "black",
                      color: "white",
                      p: 0.5,
                      borderRadius: 1,
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      display: "inline-block",
                      mt: 1,
                    }}
                  >
                    {doctor.category}
                  </Typography>

                  <Divider sx={{ my: 1, bgcolor: "#777" }} />

                  <Typography fontSize="0.8rem" color="black">
                    <strong>Qualification:</strong> {doctor.qualification}
                  </Typography>
                  <Typography fontSize="0.8rem" color="black">
                    <strong>Experience:</strong> {doctor.field_experience} years
                  </Typography>
                  <Typography
                    sx={{ color: "#F7931A", fontWeight: "bold", mt: 1 }}
                    fontSize="1rem"
                  >
                    Fee: ₹{doctor.drfee}
                  </Typography>

                  <Button
                  onClick={()=>{
                    if(token===null){
                      toast.error("login to get services");
                    }
                   else{
                    nav(`dr/${doctor.id}`)
                   }
                  }}
                    variant="contained"
                    sx={{
                      mt: 2,
                      bgcolor: "black",
                      color: "white",
                      "&:hover": { bgcolor: "#333" },
                    }}
                  >
                    Make Appointment
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}


      {!isLoading && !isError && drs?.total_pages > 1 && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt={4}
          width="100%"
        >
          <Pagination
            count={drs.total_pages}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                backgroundColor: "black",
                color: "white",
                border: "1px solid white",
              },
              "& .Mui-selected": {
                backgroundColor: "white",
                color: "black",
                fontWeight: "bold",
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default GetAllDrsPageContainer;
