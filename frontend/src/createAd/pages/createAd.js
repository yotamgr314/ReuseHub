import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";

const CreateAd = () => {
  const [adType, setAdType] = useState(null); // Select between "donationAd" or "wishAd"
  const [formData, setFormData] = useState({
    adTitle: "",
    adDescription: "",
    category: "",
    amount: 1,
    urgency: "", // Only for Wish Ads
    donationMethod: "", // Only for Donation Ads
    itemCondition: "", // Only for Donation Ads
    item: {
      name: "",
      description: "",
      images: [],
    },
    location: {
      type: "Point",
      coordinates: [],
    },
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // JWT Token

  const defaultCenter = {
    lat: 32.08088, // Default: Ramat Gan
    lng: 34.81429,
  };

  const handleMapClick = (event) => {
    setFormData({
      ...formData,
      location: {
        type: "Point",
        coordinates: [event.latLng.lng(), event.latLng.lat()], // Ensure [longitude, latitude]
      },
    });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("You must be logged in to create an ad.");
      return;
    }

    if (!formData.adTitle || !formData.adDescription || !formData.category || !formData.amount || !formData.location.coordinates.length) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/${adType === "donationAd" ? "donationAds" : "wishAds"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include JWT
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ad creation failed");
      }

      setSuccess("Ad created successfully!");
      navigate("/homePage"); // Redirect to homepage
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ marginTop: 5, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Create an Ad
        </Typography>

        {!adType ? (
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <Card onClick={() => setAdType("donationAd")} sx={{ cursor: "pointer", boxShadow: 3 }}>
                <CardActionArea>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Create a Donation Ad
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Offer an item you no longer need.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card onClick={() => setAdType("wishAd")} sx={{ cursor: "pointer", boxShadow: 3 }}>
                <CardActionArea>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Make a Wish
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Request an item you need.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Ad Title"
              name="adTitle"
              value={formData.adTitle}
              onChange={handleInputChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Description"
              name="adDescription"
              multiline
              rows={3}
              value={formData.adDescription}
              onChange={handleInputChange}
            />

            <TextField
              select
              margin="normal"
              required
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            >
              {["Furniture", "Clothing", "Electronics", "Household Appliances", "Books", "Toys", "Sports Equipment", "Other"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              margin="normal"
              required
              fullWidth
              label="Item Name"
              name="name"
              value={formData.item.name}
              onChange={handleItemInputChange}
            />

            <TextField
              margin="normal"
              fullWidth
              label="Item Description"
              name="description"
              multiline
              rows={2}
              value={formData.item.description}
              onChange={handleItemInputChange}
            />

            <TextField
              margin="normal"
              fullWidth
              label="Image URLs (comma-separated)"
              name="images"
              value={formData.item.images.join(", ")}
              onChange={handleImageUrlsChange}
            />

            {adType === "wishAd" && (
              <TextField select margin="normal" required fullWidth label="Urgency" name="urgency" value={formData.urgency} onChange={handleInputChange}>
                {["Low", "Medium", "High"].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            )}

            {adType === "donationAd" && (
              <>
                <TextField select margin="normal" required fullWidth label="Item Condition" name="itemCondition" value={formData.itemCondition} onChange={handleInputChange}>
                  {["Like New", "Gently Used", "Heavily Used"].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </>
            )}

            <LoadScriptNext googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
              <GoogleMap mapContainerStyle={{ width: "100%", height: "400px" }} center={defaultCenter} zoom={12} onClick={handleMapClick}>
                {formData.location.coordinates.length > 0 && <Marker position={{ lat: formData.location.coordinates[1], lng: formData.location.coordinates[0] }} />}
              </GoogleMap>
            </LoadScriptNext>

            {error && <Typography color="error">{error}</Typography>}
            {success && <Typography color="primary">{success}</Typography>}

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Submit Ad
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default CreateAd;
