import {
  Box,
  Modal,
  Paper,
  Typography,
  Button,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { businessAxios } from "../../api/axiosInstance";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


interface AppoinmentPaymentModalProps {
  doctor: {
    profile: string;
    doctor_name: string;
    category: string;
    qualification: string;
    drfee: number;
    id: string;
  };
  selectedSlot: string | null;
  APmodalOpen: boolean;
  handleAPmodalClose: () => void;
}

const paymentMethods = [
  { label: "Credit Card", value: 0 },
  { label: "UPI", value: 1 },
  { label: "Bank Transfer", value: 2 },
];

declare global {
  interface Window {
    Razorpay: any;
  }
}

//--------------------------------------------------------
//razorpay script

const loadScript = (src: any) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
//--------------------------------------------------------

const AppoinmentPaymentModal: React.FC<AppoinmentPaymentModalProps> = ({
  doctor,
  selectedSlot,
  APmodalOpen,
  handleAPmodalClose,
}) => {
  const email = localStorage.getItem("email");
  const name = localStorage.getItem("name");
  const nav=useNavigate();

  const { data: slotDetails, isLoading } = useQuery({
    queryKey: ["slotById", selectedSlot],
    queryFn: async () => {
      if (!selectedSlot) return null;
      const res = await businessAxios.get(
        `/DrAvailability/slot-by-id?slotId=${selectedSlot}`
      );
      return res.data.data;
    },
    enabled: !!selectedSlot,
  });

  const [paymentMethod, setPaymentMethod] = useState<number>(0);
  const [RazorOrderId, setRazorOrderId] = useState<string>("");
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  //paymet order id
  const orderidmutaion = useMutation({
    mutationFn: async () => {
      const res = businessAxios.post(
        `/Payment/razor-order-create?price=${doctor.drfee}`
      );
      return (await res).data.data;
    },
    onSuccess: (data: any) => {
      setRazorOrderId(data);
      toast.success("Proceed again to continue");
    },
    onError: (er: any) => {
      toast.error(er);
    },
  });

  //payment step 2
  const paymentMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await businessAxios.post(`/Payment/payment-making`, data);
      return res.data.data;
    },
    onSuccess: (val: any) => {
      setRazorOrderId(val);
      toast.success(val);
      nav("/");
    },
    onError: (er: any) => {
      toast.error(er);
    },
  });

  const makePaymentHandler = async () => {
    if (!isRazorpayLoaded) {
      const scriptLoaded = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      setIsRazorpayLoaded(scriptLoaded as boolean);

      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway. Please try again later.");
        return;
      }
    }

    try {
      await orderidmutaion.mutate();

      if (RazorOrderId) {
        const razorpayOptions = {
          key: "rzp_test_zTE9yV1gUOntlJ",
          amount: doctor.drfee,
          currency: "INR",
          name: "MEDICLOUDE-Payment-Gateway",
          description: "Order Payment",
          order_id: RazorOrderId,
          handler: async function (response: any) {
            const paymentData = {
              razorpay_payment_id: response.razorpay_payment_id, // Razorpay payment ID
              razorpay_order_id: response.razorpay_order_id, // Razorpay order ID
              razorpay_signature: response.razorpay_signature, // Razorpay signature
            };
            await paymentMutation.mutate({
              patientId: localStorage.getItem("id"),
              trasactionId: RazorOrderId,
              drAvailabilityId: selectedSlot,
              amount: doctor.drfee,
              paymentMethod: paymentMethod,
              razorPaymentCredential: paymentData,
            });
          },
          prefill: {
            name: name,
            email: email,
          },
          theme: {
            color: "#000",
          },
        };

        const razorpay = new window.Razorpay(razorpayOptions);
        razorpay.open();
      } else {
        toast.error("Failed to create order. Please try again.");
      }
    } catch (er: any) {
      toast.error(er);
    }
  };

  return (
    <Modal open={APmodalOpen} onClose={handleAPmodalClose}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            maxWidth: 600,
            width: "90%",
            bgcolor: "#000",
            color: "#fff",
            textAlign: "center",
            boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)",
          }}
        >
          <Avatar
            src={doctor.profile}
            sx={{
              width: 100,
              height: 100,
              mx: "auto",
              mb: 2,
              border: "2px solid #fff",
            }}
          />
          <Typography variant="h5" fontWeight={600} mb={2}>
            Confirm Payment
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {doctor.doctor_name}
          </Typography>
          <Typography variant="body2" color="gray">
            {doctor.category} | {doctor.qualification}
          </Typography>
          <Typography
            variant="h5"
            sx={{ color: "#fff", mt: 1, fontWeight: 700 }}
          >
            Fees: ₹ {doctor.drfee}
          </Typography>

          {isLoading ? (
            <Typography>Loading slot details...</Typography>
          ) : (
            <>
              <Typography variant="body1" mt={2}>
                Appointment Date:{" "}
                {new Date(slotDetails?.appointmentDate).toDateString() || "N/A"}
              </Typography>
              <Typography variant="body1" mt={1}>
                Slot Time: {slotDetails?.appointmentTime || "N/A"}
              </Typography>
            </>
          )}

          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel sx={{ color: "#fff" }}>Payment Method</InputLabel>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(Number(e.target.value))}
              sx={{ color: "#fff", bgcolor: "#333", borderRadius: 1 }}
            >
              {paymentMethods.map((method) => (
                <MenuItem key={method.value} value={method.value}>
                  {method.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box mt={4} display="flex" justifyContent="center" gap={2}>
            <Button
              onClick={() => makePaymentHandler()}
              variant="contained"
              sx={{
                bgcolor: "#fff",
                color: "#000",
                fontWeight: 700,
                ":hover": { bgcolor: "#ccc" },
              }}
            >
              {orderidmutaion.isPending  || paymentMutation.isPending ? "Loading..." : " Proceed to Pay"}
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: "#fff",
                borderColor: "#fff",
                ":hover": { bgcolor: "#fff", color: "#000" },
              }}
              onClick={handleAPmodalClose}
            >
              Cancel
            </Button>
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
};

export default AppoinmentPaymentModal;
