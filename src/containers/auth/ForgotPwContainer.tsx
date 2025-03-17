import { Box } from "@mui/material";
import ForgotPwForm from "../../components/auth/ForgotPwForm";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { useFormik } from "formik";

const ForgotPwContainer = () => {
  const navigate = useNavigate();

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
  });

  const {mutate,isPending} = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
     const res= await axiosInstance.post("/PatientAuth/forgot-password", { email });
     return res.data;
    },
    onSuccess: (data: any) => {
        console.log(data);
        
      toast.success(data.data, {
        onClose: () => navigate("/auth/verifyotp?type=reset"),
      });
    },
    onError: (error: any) => {
      toast.error(error);
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      mutate(values);
    },
  });

  return (
    <Box>
      <ForgotPwForm formik={formik} isLoading={isPending}/>
    </Box>
  );
};

export default ForgotPwContainer;
