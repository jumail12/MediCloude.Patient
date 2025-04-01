import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {  useNavigate, useParams } from "react-router-dom";
import { businessAxios } from "../api/axiosInstance";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import AppoinmentPaymentModal from "../components/modals/AppoinmentPaymentModal";

const DrByIdPageContainer = () => {
  const { id } = useParams();
  const nav = useNavigate();
  
  const { data: doctor, isLoading } = useQuery({
    queryKey: ["dr"],
    queryFn: async () => {
      const res = await businessAxios.get(`/DoctorView/id?Id=${id}`);
      return res.data.data;
    },
  });

  const { data: availableSlots, isLoading: slotLoading } = useQuery({
    queryKey: ["slots"],
    queryFn: async () => {
      const res = await businessAxios.get(
        `/DrAvailability/available-slots?drid=${id}`
      );
      return res.data.data;
    },
  });



  

  const mockAppointments = [
    { date: "2025-04-10", time: "10:00 AM", patient: "John Doe" },
    { date: "2025-04-11", time: "11:30 AM", patient: "Jane Smith" },
    { date: "2025-04-12", time: "2:00 PM", patient: "Alice Brown" },
  ];

  // State for slot selection
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const handleSlotClick = (slotId: string, isAvailable: boolean) => {
    if (isAvailable) {
      setSelectedSlot((prev) => (prev === slotId ? null : slotId));
    }
  };

  // Modal state
  const [APmodalOpen, setAPmodalOpen] = useState(false);

  const handleAPmodalClose = () => setAPmodalOpen(false);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box sx={{ p: 3, maxWidth: 1620, mx: "auto" }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          backgroundColor: "#ffffff",
          color: "#000",
        }}
      >
        <Grid container spacing={3}>
          {/* Profile Section */}
          <Grid
            item
            xs={12}
            md={4}
            display="flex"
            flexDirection="column"
            alignItems="center"
            position="relative"
            sx={{ pb: 3 }}
          >
            <IconButton
              onClick={() => nav(-1)}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                color: "#d32f2f",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                ":hover": { backgroundColor: "#d32f2f", color: "white" },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Avatar
              src={doctor?.profile || "loaging"}
              sx={{ width: 120, height: 120, bgcolor: "#000", mt: 3 }}
            />
            <Typography variant="h5" fontWeight={600} mt={2}>
              {doctor?.doctor_name || "Unknown Doctor"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {doctor?.category || "Specialization not provided"}
            </Typography>
            <Typography variant="body2" mt={1}>
              {doctor?.qualification || "Not provided"}
            </Typography>
            <Typography
              variant="body1"
              mt={1}
              sx={{ color: "#3CBDED", fontWeight: 700 }}
            >
              Fees: ₹ {doctor?.drfee ?? "Not provided"}
            </Typography>
          </Grid>

          {/* Appointment Section */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" fontWeight={600}>
              Upcoming Appointments
            </Typography>
            <Box
              sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              {mockAppointments.length === 0 ? (
                <Typography>No upcoming appointments</Typography>
              ) : (
                mockAppointments.map((appointment, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <Typography variant="body1" fontWeight={600}>
                      {appointment.patient}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {appointment.date} at {appointment.time}
                    </Typography>
                  </Paper>
                ))
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Divider for separating sections */}
        <Divider sx={{ my: 3 }} />

        {/* Doctor Details Section */}
        <Typography variant="h6" fontWeight={600}>
          Doctor Details
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              <strong>Email:</strong> {doctor?.email || "Not provided"}
            </Typography>
            <Typography variant="body1">
              <strong>Phone:</strong> {doctor?.phone || "Not available"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              <strong>Gender:</strong> {doctor?.gender || "Not specified"}
            </Typography>
            <Typography variant="body1">
              <strong>Experience:</strong>{" "}
              {doctor?.field_experience || "Not available"} years
            </Typography>
          </Grid>
        </Grid>

        {/* Divider for separating sections */}
        <Divider sx={{ my: 3 }} />

        {/* About Section - Full Width */}
        <Typography variant="h6" fontWeight={600}>
          About
        </Typography>
        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: "#f9f9f9",
            borderRadius: 2,
            minHeight: "150px",
          }}
        >
          <Typography variant="body1">
            {doctor?.about || "No information provided."}
          </Typography>
        </Box>
       
{/* Available Slots Section */}
<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ my: 3 }}>
          <Typography variant="h6" fontWeight={600}>Available Slots</Typography>
          <Button
          onClick={()=>setAPmodalOpen(true)}
            variant="contained"
            sx={{
              backgroundColor: "#000",
              color: "#fff",
              ":hover": { backgroundColor: "#333" },
            }}
            disabled={!selectedSlot}
          >
            Make Appointment
          </Button>
        </Stack>

        {/* Slot List */}
        <Box sx={{ mt: 2, p: 2, bgcolor: "#f9f9f9", borderRadius: 2 }}>
          {slotLoading ? (
            <Typography>Loading available slots...</Typography>
          ) : availableSlots && availableSlots.length > 0 ? (
            availableSlots.map((slot: any) => (
              <Box key={slot.appointmentDate} sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  {new Date(slot.appointmentDate).toDateString()}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {slot.appointmentTimes.map((timeSlot: any) => (
                    <Paper
                      key={timeSlot.id}
                      onClick={() => handleSlotClick(timeSlot.id, timeSlot.isAvailable)}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: selectedSlot === timeSlot.id ? "#1976d2" :
                          timeSlot.isAvailable ? "#ffffff" : "#d3d3d3",
                        cursor: timeSlot.isAvailable ? "pointer" : "not-allowed",
                        minWidth: "100px",
                        textAlign: "center",
                        color: selectedSlot === timeSlot.id ? "#fff" : "inherit",
                        "&:hover": timeSlot.isAvailable ? { backgroundColor: "#e3f2fd", transform: "scale(1.05)" } : {},
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {timeSlot.appointmentTime}
                      </Typography>
                      {!timeSlot.isAvailable && <Typography variant="caption" color="error">Booked</Typography>}
                    </Paper>
                  ))}
                </Box>
              </Box>
            ))
          ) : (
            <Typography>No available slots.</Typography>
          )}
        </Box> 

      </Paper>


    
      {/* Appointment Payment Modal */}
      {APmodalOpen && (
        <AppoinmentPaymentModal 
          doctor={doctor} 
          selectedSlot={selectedSlot} 
          APmodalOpen={APmodalOpen} 
          handleAPmodalClose={handleAPmodalClose} 
        />
      )}


    </Box>
    
  );
}

export default DrByIdPageContainer