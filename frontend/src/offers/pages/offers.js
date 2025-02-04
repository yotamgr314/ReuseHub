import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardContent, Modal, Box, Button } from "@mui/material";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/offers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const responseData = await response.json();
        if (!response.ok) throw new Error(responseData.message || "Failed to fetch offers.");

        setOffers(responseData.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchOffers();
  }, []);

  const handleOfferClick = (offer) => {
    if (offer.offerStatus === "Rejected") {
      setModalMessage("The ad you made an offer on has been completed or deleted.");
      setOpenModal(true);
    }
  };

  return (
    <Container>
      <Typography variant="h4">My Offers</Typography>

      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={2}>
        {offers.map((offer) => (
          <Grid item xs={12} sm={6} key={offer._id}>
            <Card onClick={() => handleOfferClick(offer)} sx={{ cursor: "pointer", padding: 2 }}>
              <CardContent>
                <Typography variant="h6">{offer.adId?.adTitle || "Unknown Ad"}</Typography>
                <Typography color="primary">Status: {offer.offerStatus}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal for rejected offers */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", padding: 4, bgcolor: "white", boxShadow: 24, borderRadius: 2 }}>
          <Typography variant="h6">{modalMessage}</Typography>
          <Button onClick={() => setOpenModal(false)} variant="contained" sx={{ mt: 2 }}>OK</Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default Offers;
