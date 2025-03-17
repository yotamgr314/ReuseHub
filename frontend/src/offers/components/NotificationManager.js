// frontend/offers/components/NotificationManager.js
import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, Stack } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';

// Initialize socket (can be managed globally or here)
const socket = io("http://localhost:5000");

const NotificationManager = () => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
  });

  // Join the user's room based on the token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id; // Ensure the token contains the "id" field
        console.log("🔹 [NotificationManager] joinRoom userId:", userId);
        socket.emit("joinRoom", userId);
      } catch (error) {
        console.error("Error decoding token in NotificationManager:", error);
      }
    }
  }, []);

  // Listen for the "offerApproved" event
  useEffect(() => {
    socket.on("offerApproved", (data) => {
      console.log("🔸 [NotificationManager] Received offerApproved event:", data);
      setNotification({
        open: true,
        message: data.message,
      });
    });
    return () => {
      socket.off("offerApproved");
    };
  }, []);

  const handleClose = () => {
    setNotification({ open: false, message: '' });
  };

  return (
    <Modal open={notification.open} onClose={handleClose} closeAfterTransition>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <AutoAwesomeIcon sx={{ fontSize: '2rem', mr: 1, color: "#FFD700" }} />
          Offer Approved!
        </Typography>
        <Typography variant="body1" gutterBottom>
          {notification.message}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button variant="contained" onClick={handleClose}>
            Close
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default NotificationManager;
