import React, { useState, useEffect } from "react";
import { TextField, MenuItem, Button, Box, Typography } from "@mui/material";
import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";

const DonationAdForm = ({ token, navigate }) => {
  const [formData, setFormData] = useState({
    adTitle: "",
    adDescription: "",
    category: "",
    amount: 1,
    donationMethod: "Pickup",
    itemCondition: "Gently Used",
    item: { name: "", description: "", images: [] },
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

  const handleImageUrlsChange = (e) => {
    const urls = e.target.value.split(",").map((url) => url.trim());
    setFormData({
      ...formData,
      item: { ...formData.item, images: urls },
    });
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
      const response = await fetch(`http://localhost:5000/api/donationAds`, {
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
    
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Typography variant="h3" gutterBottom fontWeight="bold">
           Donation Ad
        </Typography>
      <TextField name="adTitle" label="Ad Title" fullWidth required onChange={handleInputChange} />
      <TextField name="adDescription" label="Description" fullWidth required multiline rows={3} onChange={handleInputChange} />

      <TextField select name="category" label="Category" fullWidth required onChange={handleInputChange}>
        {["Furniture", "Clothing", "Electronics", "Books", "Toys", "Other"].map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      <TextField select name="donationMethod" label="Donation Method" fullWidth required onChange={handleInputChange}>
        {["Pickup", "Delivery", "Other"].map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      <TextField select name="itemCondition" label="Item Condition" fullWidth required onChange={handleInputChange}>
        {["Like New", "Gently Used", "Heavily Used"].map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      <TextField name="amount" type="number" label="Amount" fullWidth required onChange={handleInputChange} />

      <TextField name="name" label="Item Name" fullWidth required onChange={handleItemInputChange} />
      <TextField name="description" label="Item Description" fullWidth multiline rows={2} onChange={handleItemInputChange} />
      <TextField name="images" label="Image URLs (comma separated)" fullWidth onChange={handleImageUrlsChange} />

      <LoadScriptNext googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap mapContainerStyle={{ width: "100%", height: "400px" }} center={userLocation} zoom={12} onClick={handleMapClick}>
          {formData.location.coordinates.length > 0 && <Marker position={{ lat: formData.location.coordinates[1], lng: formData.location.coordinates[0] }} />}
        </GoogleMap>
      </LoadScriptNext>

      {error && <Typography color="error">{error}</Typography>}
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
        Submit Donation Ad
      </Button>
    </Box>
  );
};

export default DonationAdForm;
