// frontend/src/createAd/components/donationAdForm.js
import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";
import { PhotoCamera, Delete } from "@mui/icons-material";


const DonationAdForm = ({ token, navigate }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [formData, setFormData] = useState({
    adTitle: "",
    adDescription: "",
    category: "Furniture", // יש לוודא שיש ערך ברירת מחדל
    amount: 1,
    donationMethod: "Pickup",
    itemCondition: "Gently Used",
    item: { name: "", description: "", images: [] },
    location: { type: "Point", coordinates: [0, 0] }, // תיקון ברירת המחדל
    });
  

  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setFormData((prev) => ({
            ...prev,
            location: {
              type: "Point",
              coordinates: [
                position.coords.longitude,
                position.coords.latitude,
              ],
            },
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };
  
  const removeImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  
  const handleItemInputChange = (e) => {
    setFormData({
      ...formData,
      item: { ...formData.item, [e.target.name]: e.target.value },
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
  
    console.log("🔹 Form Data Before Submission:", formData);
  
    const formDataToSend = new FormData();
    formDataToSend.append("adTitle", formData.adTitle);
    formDataToSend.append("adDescription", formData.adDescription);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("amount", formData.amount);
    formDataToSend.append("donationMethod", formData.donationMethod);
    formDataToSend.append("itemCondition", formData.itemCondition);
    formDataToSend.append("location", JSON.stringify(formData.location));
    formDataToSend.append("item[name]", formData.item.name);
    formDataToSend.append("item[description]", formData.item.description);
  
    selectedImages.forEach((image) => {
      formDataToSend.append("images", image);
    });
  
    try {
      const response = await fetch(`https://reusehub-h9o5.onrender.com/api/donationAds`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Ad creation failed");
      }
  
      console.log("🔹 Server Response:", data);
      navigate("/homePage");
    } catch (err) {
      setError(err.message);
      console.error("🔺 Error:", err);
    }
  };
    

  return (
    <Paper elevation={3} sx={{ padding: 4, marginTop: 2 }}>
                      <Typography variant="h3" gutterBottom fontWeight="bold">
                      Grante items a second life
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
              {[
                "Furniture",
                "Clothing",
                "Electronics",
                "Books",
                "Toys",
                "Other",
              ].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Donation Method */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              name="donationMethod"
              label="Donation Method"
              fullWidth
              required
              onChange={handleInputChange}
            >
              {["Pickup", "Delivery", "Other"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Item Condition */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              name="itemCondition"
              label="Item Condition"
              fullWidth
              required
              onChange={handleInputChange}
            >
              {["Like New", "Gently Used", "Heavily Used"].map((option) => (
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

          {/* Image URLs */}
          <Grid item xs={12}>
{/* Upload Images */}
<Grid item xs={12}>
  <Typography variant="h6">Upload Images</Typography>
  <Button
    variant="contained"
    component="label"
    startIcon={<PhotoCamera />}
    sx={{ bgcolor: "#1976D2", "&:hover": { bgcolor: "#1565C0" }, mt: 1 }}
  >
    Choose Files
    <input type="file" multiple accept="image/*" hidden onChange={handleImageUpload} />
  </Button>

  {/* Image Previews */}
  <Stack direction="row" spacing={2} mt={2} flexWrap="wrap">
    {selectedImages.map((image, index) => (
      <Box key={index} sx={{ position: "relative", width: 100, height: 100 }}>
        <img
          src={URL.createObjectURL(image)}
          alt="Preview"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
        <IconButton
          size="small"
          onClick={() => removeImage(index)}
          sx={{
            position: "absolute",
            top: -10,
            right: -10,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <Delete sx={{ color: "red" }} />
        </IconButton>
      </Box>
    ))}
  </Stack>
</Grid>

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
                  <Marker
                    position={{
                      lat: formData.location.coordinates[1],
                      lng: formData.location.coordinates[0],
                    }}
                  />
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
          <Button 
  type="submit" 
  variant="contained"
  sx={{ 
    padding: "12px 24px", 
    fontSize: "1.2rem", 
    width: "75%", 
    bgcolor: "#1976D2", 
    "&:hover": { bgcolor: "#1565C0" } 
  }}
>
  Submit Donation Ad
</Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default DonationAdForm;