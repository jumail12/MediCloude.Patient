import { Box } from "@mui/material";
import LoginForm from "../../components/auth/LoginForm";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "sonner";
import axiosInstance from "../../api/axiosInstance";
import { useMutation } from "@tanstack/react-query";

const LoginContainer = () => {
  const navigate = useNavigate();

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password should be of minimum 6 characters length")
      .matches(
        /^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one letter, one capital letter, one number, and one special character."
      )
      .required("Password is required"),
  });

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const res = await axiosInstance.post("/PatientAuth/login", {
        email,
        password,
      });
      return res.data;
    },
    onSuccess: (res: any) => {
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      localStorage.setItem("name", res.data.patient_name);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("id", res.data.patient_id);
      toast.success("User Login Successfull", {
        duration: 3000, 
        onAutoClose: () => navigate("/",{replace:true}),
      });
    },
    onError: (error: any) => {
      toast.error(error);
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      loginMutation.mutate(values);
    },
  });

  return (
    <Box>
      <LoginForm formik={formik} isLoading={loginMutation.isPending} />
    </Box>
  );
};

export default LoginContainer;
