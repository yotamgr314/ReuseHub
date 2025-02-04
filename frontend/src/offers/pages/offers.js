import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardContent, Button, Modal, Box } from "@mui/material";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        if (!token) return;

        const response = await fetch("http://localhost:5000/api/offers", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
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
  }, [token]); // ✅ Fix: Ensure the dependency array remains constant

  const handleApproveOffer = async (offerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/offers/${offerId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userWhoMadeTheOfferApproval: true }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to approve offer.");

      // ✅ Update the offer status in the UI
      setOffers((prevOffers) =>
        prevOffers.map((offer) =>
          offer._id === offerId ? { ...offer, offerStatus: "Accepted" } : offer
        )
      );

      setModalMessage("Offer approved successfully!");
      setOpenModal(true);
    } catch (error) {
      setModalMessage(`Error: ${error.message}`);
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
            <Card sx={{ padding: 2 }}>
              <CardContent>
                <Typography variant="h6">{offer.adId?.adTitle || "Unknown Ad"}</Typography>
                <Typography color="primary">Status: {offer.offerStatus}</Typography>

                {offer.offerStatus === "Pending" && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleApproveOffer(offer._id)}
                    sx={{ mt: 1 }}
                  >
                    Approve
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal for Confirmation Messages */}
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
