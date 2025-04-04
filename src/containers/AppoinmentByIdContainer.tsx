import { 
    Box, Card, CardContent, Typography, CircularProgress, 
    Avatar, Grid, Divider, Button 
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { businessAxios } from '../api/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';

const AppointmentByIdContainer = () => {
    const { bId } = useParams();
    const navigate = useNavigate();

    const { data: booking, isLoading, error } = useQuery({
        queryKey: ["booking", bId],
        queryFn: async () => {
            const res = await businessAxios.get(`/DrUpcomingAppoinments/patient-up-bookings-byid?id=${bId}`);
            return res.data.data;
        },
        enabled: !!bId, 
    });

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
                <CircularProgress size={40} />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" textAlign="center" mt={4}>
                Failed to load booking details.
            </Typography>
        );
    }

    if (!booking) {
        return (
            <Typography color="textSecondary" textAlign="center" mt={4}>
                No appointment details available.
            </Typography>
        );
    }

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", mt: 5, p: 3 }}>
            <Card 
                sx={{
                    p: 4,
                    borderRadius: 4,
                    boxShadow: 6,
                    border: "1px solid #000", 
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": { boxShadow: 8, transform: "scale(1.02)" },
                }}
            >
                <CardContent>
                    <Grid container spacing={4} alignItems="center">
                        {/* Doctor Profile Image */}
                        <Grid item xs={4} textAlign="center">
                            <Avatar 
                                src={booking.profile || "/default-avatar.png"} 
                                alt={booking.doctor_name} 
                                sx={{ width: 120, height: 120, mx: "auto", border: "3px solid black" }} 
                            />
                            <Typography variant="h5" sx={{ fontWeight: "bold", color: "black", mt: 2 }}>
                                Dr. {booking.doctor_name || "N/A"}
                            </Typography>
                            <Typography variant="body1"> {booking.specialization || "N/A"}</Typography>
                        </Grid>

                        {/* Doctor Details - Now Properly Aligned */}
                        <Grid item xs={8}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                <Typography variant="body1"><b>Email:</b> {booking.email}</Typography>
                                <Typography variant="body1"><b>Phone:</b> {booking.phone || "N/A"}</Typography>
                               
                                <Typography variant="body1"><b>Experience:</b> {booking.field_experience ? `${booking.field_experience} years` : "N/A"}</Typography>
                                <Typography variant="body1"><b>Qualification:</b> {booking.qualification || "N/A"}</Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    {/* Appointment Details */}
                    <Box textAlign="center">
                        <Typography variant="h5" sx={{ color: "black", fontWeight: "bold" }}>
                            Appointment Details
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            <b>Date:</b> {new Date(booking.appointmentDate).toDateString()}
                        </Typography>
                        <Typography variant="body1">
                            <b>Time:</b> {new Date(`1970-01-01T${booking.appointmentTime}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </Typography>
                        <Typography variant="body1">
                            <b>Room:</b> {booking.roomId ? `Room ${booking.roomId}` : "N/A"}
                        </Typography>

                        {/* Start Video Call Button */}
                        {booking.roomId && (
                            <Button 
                                variant="contained" 
                                sx={{
                                    mt: 4,
                                    bgcolor: "black",
                                    color: "white",
                                    fontSize: "1.1rem",
                                    px: 4,
                                    py: 1.2,
                                    "&:hover": { bgcolor: "#333" },
                                    transition: "0.3s",
                                }} 
                                onClick={() => navigate(`/video-call/${booking.roomId}`)}
                            >
                                Start Video Call
                            </Button>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default AppointmentByIdContainer;
