import { Box } from "@mui/material";
import { Route, Routes, useLocation } from "react-router-dom";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import ForgotPw from "./pages/auth/ForgotPw";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ResetPw from "./pages/auth/ResetPw";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotFoundPage from "./components/NotFoundPage";
import GetAllDrsPage from "./pages/GetAllDrsPage";
import DrByIdPage from "./pages/DrByIdPage";
function App() {
  const location = useLocation();
  const hideNavFot = location.pathname.startsWith("/auth");
  return (
    <Box>
      <Toaster position="top-right" richColors />
      {!hideNavFot && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/consult" element={<GetAllDrsPage/>}/>
        <Route path="/consult/dr/:id" element={<DrByIdPage/>}/>

        <Route path="/auth">
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="forgotpw" element={<ForgotPw />} />
          <Route path="verifyotp" element={<VerifyOtp />} />
          <Route path="resetpw" element={<ResetPw />} />
        </Route>
      </Routes>
      {!hideNavFot && <Footer />}
    </Box>
  );
}

export default App;
