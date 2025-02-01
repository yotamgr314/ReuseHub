import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Link } from '@mui/material'; // ✅ ADDED IMPORT FOR Link
import { useNavigate } from 'react-router-dom'; // Added useNavigate for SPA navigation

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate(); // INITIALIZED NAVIGATION FUNCTION

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/authenticate/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess('Registration successful! Please log in.');
      navigate('/login'); // ✅ ADDED NAVIGATION TO LOGIN PAGE AFTER SUCCESSFUL REGISTRATION

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 1, width: '100%' }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            value={formData.name}
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
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="primary">{success}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 3 }} // ✅ INCREASED BOTTOM MARGIN FOR BETTER SPACING
          >
            Register
          </Button>

          {/* STYLED LOGIN LINK BELOW REGISTER BUTTON */}
          <Typography variant="body2" sx={{ textAlign: 'center', color: "gray" }}>
            Already have an account?{" "}
            <Link 
              component="button"
              variant="body2"
              sx={{
                color: "primary.main",
                fontWeight: "bold",
                fontSize: "1rem", // ✅ MADE TEXT SLIGHTLY BIGGER
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" }
              }}
              onClick={() => navigate('/login')} // ✅ NAVIGATES TO LOGIN PAGE
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
