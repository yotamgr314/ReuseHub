import React, { useState, useEffect } from "react";
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
import { jwtDecode } from "jwt-decode";

const CreateAd = () => {
  const [adType, setAdType] = useState(null); // "donationAd" or "wishAd"
  const [formData, setFormData] = useState({
    adTitle: "",
    adDescription: "",
    category: "",
    amount: 1,
    urgency: "Medium", // Default for Wish Ads
    donationMethod: "Pickup", // Default for Donation Ads
    itemCondition: "Gently Used", // Default for Donation Ads
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
  const [userLocation, setUserLocation] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }

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
              coordinates: [position.coords.longitude, position.coords.latitude],
            },
          }));
        },
        () => {
          setUserLocation({ lat: 32.08088, lng: 34.81429 }); // Default to Ramat Gan
        }
      );
    } else {
      setUserLocation({ lat: 32.08088, lng: 34.81429 }); // Default to Ramat Gan
    }
  }, [navigate, token]);

  const handleMapClick = (event) => {
    setFormData({
      ...formData,
      location: {
        type: "Point",
        coordinates: [event.latLng.lng(), event.latLng.lat()],
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

    if (!formData.adTitle || formData.adTitle.length < 5) {
      setError("Ad title must be at least 5 characters long.");
      return;
    }

    if (!formData.adDescription || !formData.category || !formData.amount || !formData.location.coordinates.length) {
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
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ad creation failed");
      }

      setSuccess("Ad created successfully!");
      navigate("/homePage");
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
                    <Typography variant="h5">Create a Donation Ad</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card onClick={() => setAdType("wishAd")} sx={{ cursor: "pointer", boxShadow: 3 }}>
                <CardActionArea>
                  <CardContent>
                    <Typography variant="h5">Make a Wish</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField id="adTitle" name="adTitle" label="Ad Title" fullWidth required onChange={handleInputChange} />

            <TextField id="adDescription" name="adDescription" label="Description" fullWidth required multiline rows={3} onChange={handleInputChange} />

            <TextField select id="category" name="category" label="Category" fullWidth required onChange={handleInputChange}>
              {["Furniture", "Clothing", "Electronics", "Books", "Toys", "Other"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            {adType === "donationAd" && (
              <>
                <TextField select id="donationMethod" name="donationMethod" label="Donation Method" fullWidth required onChange={handleInputChange}>
                  {["Pickup", "Delivery", "Other"].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField select id="itemCondition" name="itemCondition" label="Item Condition" fullWidth required onChange={handleInputChange}>
                  {["Like New", "Gently Used", "Heavily Used"].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </>
            )}

            <LoadScriptNext googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
              <GoogleMap mapContainerStyle={{ width: "100%", height: "400px" }} center={userLocation} zoom={12} onClick={handleMapClick}>
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
