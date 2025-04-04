import { 
    Box, Pagination, Card, CardContent, Typography, CircularProgress, Grid, Avatar
  } from "@mui/material";
  import { businessAxios } from "../api/axiosInstance";
  import { useQuery } from "@tanstack/react-query";
  import { useState } from "react";
import { useNavigate } from "react-router-dom";
  
  // Define types for API response
  interface Appointment {
    profile: string;
    specialization: string;
    id: string;
    doctor_name: string;
    doctor_avatar?: string; // Optional avatar URL
    appointmentDate: string;
    appointmentTime: string;
  }
  
  interface APIResponse {
    items: Appointment[];
    total_pages: number;
  }
  
  const AppointmentContainer = () => {
    const pageSize = 4;
    const [currentPage, setCurrentPage] = useState<number>(1);
  
    // Fetch upcoming appointments
    const { data: upcomingBookings, isLoading: bookLoading } = useQuery<APIResponse>({
      queryKey: ["upcoming-book", currentPage],
      queryFn: async (): Promise<APIResponse> => {
        const res = await businessAxios.get(
          `/DrUpcomingAppoinments/patient-up-bookings?pageNumber=${currentPage}&pageSize=${pageSize}`
        );
        return res.data.data;
      },
      placeholderData: (prevData) => prevData,
    });

    // Handle pagination change
    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
      setCurrentPage(value);
    };

    const nav=useNavigate();
  
    return (
      <Box 
        sx={{ 
          maxWidth: 600,  
          mx: "auto", 
          mt: 5, 
          p: 2, 
          textAlign: "center",
        }}
      >
        {/* Heading */}
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1E3A8A", mb: 4 }}>
          Upcoming Appointments
        </Typography>
  
        {bookLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          <>
            {upcomingBookings?.items?.length ? (
              upcomingBookings.items.map((appointment) => (
                <Card 
                  key={appointment.id}
                  sx={{
                    mb: 2,  
                    p: 2,
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: "0.3s",
                    backgroundColor: "white",
                    border: "1px solid #1E3A8A",
                    "&:hover": { boxShadow: 6, transform: "scale(1.02)" },
                    cursor:"pointer"
                  }}
                  onClick={()=>nav(`/appointments/${appointment.id}`)}
                >
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      {/* Doctor Avatar */}
                      <Grid item>
                        <Avatar 
                          src={appointment.profile || "https://via.placeholder.com/50"} 
                          alt={appointment.doctor_name} 
                          sx={{ width: 80, height: 80, border: "2px solid #1E3A8A" }} 
                        />
                      </Grid>

                      {/* Doctor Name & Specialization */}
                      <Grid item xs>
                        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1E3A8A" }}>
                          Dr. {appointment.doctor_name || "N/A"}
                        </Typography>
                        <Typography sx={{ color: "#1E3A8A" }}>
                          {appointment.specialization || "N/A"}
                        </Typography>
                      </Grid>
  
                      {/* Date & Time */}
                      <Grid item xs={4} sx={{ textAlign: "right" }}>
                        <Typography sx={{ color: "#333", fontSize: 14 }}>
                          <b>Date:</b> {new Date(appointment.appointmentDate).toDateString()}
                        </Typography>
                        <Typography sx={{ color: "#333", fontSize: 14 }}>
                          <b>Time:</b> {new Date(`1970-01-01T${appointment.appointmentTime}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography sx={{ color: "#777", fontSize: 18, mt: 4 }}>
                No upcoming appointments.
              </Typography>
            )}
  
            {/* Pagination */}
            {!bookLoading && (upcomingBookings?.total_pages ?? 1) > 1 && (
              <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
                <Pagination
                  count={upcomingBookings?.total_pages ?? 1}
                  page={currentPage}
                  onChange={handlePageChange}
                  variant="outlined"
                  shape="rounded"
                  size="medium"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "#1E3A8A",
                      border: "1px solid #1E3A8A",
                      transition: "all 0.3s ease",
                      fontSize: "14px",
                    },
                    "& .Mui-selected": {
                      backgroundColor: "#1E3A8A",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "6px",
                    },
                    "& .MuiPaginationItem-root:hover": {
                      backgroundColor: "#1E3A8A",
                      color: "white",
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    );
  };
  
  export default AppointmentContainer;
