import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { Snackbar, Slide } from "@mui/material";
import { useNavigate } from "react-router-dom"; 
import "./Register.css";
import Footer from "../components/Footer"; 
import { Link } from 'react-router-dom';
import { useEffect } from "react";
import { jwtDecode } from 'jwt-decode';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    try{
      if (token) {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp < Date.now() / 1000) {
          navigate('/login');
        }
      }
      else {
        navigate('/login');
      }
    } catch (error) { 
      navigate('/login');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSnackbarMessage("");
    setSnackbarType("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setSnackbarType("error");
      setSnackbarMessage("Passwords do not match");
      setOpenSnackbar(true);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/users/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setSnackbarType("success");
      setSnackbarMessage(response.data.message || "You registered successfully.");

      setOpenSnackbar(true);

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        document.title = "Login - Your Website"; // Update the browser tab title
        navigate("/login"); // Navigate to login page
      }, 3000);
    } catch (error) {
      setSnackbarType("error");
      setSnackbarMessage(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    }
    setLoading(false);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleSocialRegister = (provider) => {
    const url = `/users/auth/${provider}`;
    window.location.href = url;
  };

  const TransitionUp = (props) => {
    return <Slide {...props} direction="up" />;
  };

  return (
    <>
      <div className="container">
        <div className="left">
          <div className="slider">
            <img
              src="https://i.postimg.cc/2SvZHdSB/flowers-1854075-1280.jpg"
              alt="Slide 1"
              className="sliderImage"
            />
          </div>
        </div>

        <div className="right">
          <div className="formContainer">
            <div className="logo">★</div>
            <h2 className="heading">Welcome to our website!</h2>
            <p className="subtext">Please enter your details</p>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input"
                required
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                required
              />
              <div className="passwordField">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input"
                  required
                />
                <span onClick={() => setShowPassword(!showPassword)} className="icon">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className="passwordField">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input"
                  required
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="icon"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button type="submit" className="signupButton" disabled={loading}>
                {loading ? "Registering..." : "Sign Up"}
              </button>
            </form>
            <p>
              Already have an account? <Link to="/login" className="link">Login</Link>
            </p>
          </div>
        </div>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000} 
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          TransitionComponent={TransitionUp}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          ContentProps={{
            className: snackbarType === "error" ? "errorSnackbar" : "successSnackbar",
          }}
        />
      </div><br></br><br></br>
      <Footer />
    </>
  );
};

export default Signup;
