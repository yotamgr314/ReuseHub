import React, { useState } from "react";
import { TextField, Button, Box, Typography, Container, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [profilePic, setProfilePic] = useState(null); // new state for profile picture
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const dataToSend = new FormData();
      dataToSend.append("firstName", formData.firstName);
      dataToSend.append("lastName", formData.lastName);
      dataToSend.append("email", formData.email);
      dataToSend.append("password", formData.password);
      if (profilePic) {
        dataToSend.append("profilePic", profilePic);
      }

      const response = await fetch("http://localhost:5000/api/authenticate/register", {
        method: "POST",
        body: dataToSend,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
      setSuccess("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
            Upload Profile Picture
            <input type="file" name="profilePic" hidden onChange={handleFileChange} accept="image/*" />
          </Button>
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="primary">{success}</Typography>}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 3 }}>
            Register
          </Button>
          <Typography variant="body2" sx={{ textAlign: "center", color: "gray" }}>
            Already have an account?{" "}
            <Link
              component="button"
              variant="body2"
              sx={{
                color: "primary.main",
                fontWeight: "bold",
                fontSize: "1rem",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => navigate("/login")}
            >
              Log in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
