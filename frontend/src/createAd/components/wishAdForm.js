// frontend/src/createAd/components/wishAdForm.js
import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Box,
  Grid,
  Slider,
  Paper,
  Typography,
} from "@mui/material";
import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";

const WishAdForm = ({ token, navigate }) => {
  const [formData, setFormData] = useState({
    adTitle: "",
    adDescription: "",
    category: "",
    urgency: "Medium", // Default value
    amount: 1,
    item: { name: "", description: "" },
    location: { type: "Point", coordinates: [] },
  });

  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setFormData((prev) => ({
            ...prev,
            location: { type: "Point", coordinates: [position.coords.longitude, position.coords.latitude] },
          }));
        },
        () => {
          setUserLocation({ lat: 32.08088, lng: 34.81429 });
        }
      );
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemInputChange = (e) => {
    setFormData({
      ...formData,
      item: { ...formData.item, [e.target.name]: e.target.value },
    });
  };

  const handleUrgencyChange = (event, newValue) => {
    const urgencyLevels = ["Low", "Medium", "High"];
    setFormData({ ...formData, urgency: urgencyLevels[newValue] });
  };

  const handleMapClick = (event) => {
    setFormData({
      ...formData,
      location: {
        type: "Point",
        coordinates: [event.latLng.lng(), event.latLng.lat()],
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.adTitle || formData.adTitle.length < 5) {
      setError("Ad title must be at least 5 characters long.");
      return;
    }
    if (!formData.adDescription || !formData.category || !formData.amount || !formData.location.coordinates.length) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/wishAds`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ad creation failed");
      }

      navigate("/homePage");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    
    <Paper elevation={3} sx={{ padding: 4, marginTop: 2 }}>
                <Typography variant="h3" gutterBottom fontWeight="bold">
                   Make a wish
                </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          {/* Ad Title */}
          <Grid item xs={12}>
            <TextField
              name="adTitle"
              label="Ad Title"
              fullWidth
              required
              onChange={handleInputChange}
            />
          </Grid>

          {/* Ad Description */}
          <Grid item xs={12}>
            <TextField
              name="adDescription"
              label="Description"
              fullWidth
              required
              multiline
              rows={3}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Category */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              name="category"
              label="Category"
              fullWidth
              required
              onChange={handleInputChange}
            >
              {["Furniture", "Clothing", "Electronics", "Books", "Toys", "Other"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Amount */}
          <Grid item xs={12} sm={6}>
            <TextField
              name="amount"
              type="number"
              label="Amount"
              fullWidth
              required
              onChange={handleInputChange}
            />
          </Grid>

          {/* Urgency with Scroll Slider */}
          <Grid item xs={12}>
            <Typography gutterBottom>Urgency Level</Typography>
            <Slider
              value={["Low", "Medium", "High"].indexOf(formData.urgency)}
              onChange={handleUrgencyChange}
              min={0}
              max={2}
              step={1}
              marks={[
                { value: 0, label: "Low" },
                { value: 1, label: "Medium" },
                { value: 2, label: "High" },
              ]}
              sx={{ mt: 2 }}
            />
          </Grid>

          {/* Item Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              name="name"
              label="Item Name"
              fullWidth
              required
              onChange={handleItemInputChange}
            />
          </Grid>

          {/* Item Description */}
          <Grid item xs={12} sm={6}>
            <TextField
              name="description"
              label="Item Description"
              fullWidth
              multiline
              rows={2}
              onChange={handleItemInputChange}
            />
          </Grid>

          {/* Google Maps Location Picker */}
          <Grid item xs={12}>
            <Typography gutterBottom>Pick Location</Typography>
            <LoadScriptNext googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "350px", borderRadius: 10 }}
                center={userLocation}
                zoom={12}
                onClick={handleMapClick}
              >
                {formData.location.coordinates.length > 0 && (
                  <Marker position={{ lat: formData.location.coordinates[1], lng: formData.location.coordinates[0] }} />
                )}
              </GoogleMap>
            </LoadScriptNext>
          </Grid>

          {/* Error Message */}
          {error && (
            <Grid item xs={12}>
              <Typography color="error" textAlign="center">
                {error}
              </Typography>
            </Grid>
          )}

          {/* Submit Button */}
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Button type="submit" variant="contained">
              Submit Wish Ad
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default WishAdForm;
