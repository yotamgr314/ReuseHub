// frontend/src/offers/pages/Offers.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
  Modal,
  Box,
} from "@mui/material";
import { CheckCircle, Cancel, ChatBubbleOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ApprovalModal from "../components/ApprovalModal"; // NEW: Import ApprovalModal

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [selectedOfferForRating, setSelectedOfferForRating] = useState(null); // NEW
  const [approvalModalOpen, setApprovalModalOpen] = useState(false); // NEW
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        if (!token) return;

        const response = await fetch("http://localhost:5000/api/offers", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const responseData = await response.json();
        console.log("📩 Offers received:", responseData);

        if (!response.ok)
          throw new Error(responseData.message || "Failed to fetch offers.");

        setOffers(responseData.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchOffers();
  }, [token]);

  const handleOpenApprovalModal = (offerId, adId) => {
    // Optionally, you could check that the offer exists here before opening
    setSelectedOfferForRating(offerId);
    setApprovalModalOpen(true);
  };

  const handleRejectOffer = async (offerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/offers/${offerId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ offerStatus: "Rejected" }),
      });

      const data = await response.json();
      console.log("❌ Offer rejected:", data);

      if (!response.ok) throw new Error(data.message || "Failed to reject offer.");

      setOffers((prevOffers) =>
        prevOffers.map((offer) =>
          offer._id === offerId ? { ...offer, offerStatus: "Rejected" } : offer
        )
      );
    } catch (error) {
      console.error("Error rejecting offer:", error);
      setModalMessage(`Error: ${error.message}`);
      setOpenModal(true);
    }
  };

  // Called when approval + rating is submitted successfully
  const handleApprovalSuccess = (data) => {
    console.log("Approval & rating submitted:", data);
    // If donation is complete, the server may indicate that in the message.
    if (data.message?.includes("Donation completed")) {
      setOffers([]); // Clear offers or trigger a refresh
      setModalMessage("Donation completed! The ad and related offers are removed.");
      setOpenModal(true);
    } else {
      // For partial donation, you might update the offers list accordingly.
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        My Offers
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={3}>
        {offers.map((offer) => (
          <Grid item xs={12} key={offer._id}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                padding: 2,
                borderRadius: 3,
                boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
                transition: "0.3s",
                "&:hover": { boxShadow: "0px 8px 30px rgba(0,0,0,0.15)" },
              }}
            >
              <CardContent sx={{ flex: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {offer.adId?.adTitle || "Unknown Ad"}
                  </Typography>
                  <Chip
                    label={offer.offerStatus}
                    sx={{
                      fontWeight: "bold",
                      bgcolor:
                        offer.offerStatus === "Accepted"
                          ? "#28A745"
                          : offer.offerStatus === "Rejected"
                          ? "#DC3545"
                          : "#FFC107",
                      color: "white",
                    }}
                  />
                </Stack>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Message:</strong>{" "}
                  {offer.chat?.messages?.[0]?.text || "No message sent"}
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<CheckCircle />}
                    onClick={() => handleOpenApprovalModal(offer._id, offer.adId?._id)}
                    sx={{ bgcolor: "#28A745", "&:hover": { bgcolor: "#218838" } }}
                  >
                    Approve
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<Cancel />}
                    onClick={() => handleRejectOffer(offer._id)}
                    disabled={offer.offerStatus === "Rejected"}
                    sx={{ bgcolor: "#DC3545", "&:hover": { bgcolor: "#C82333" } }}
                  >
                    Reject
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<ChatBubbleOutline />}
                    onClick={() => {
                      if (offer.chat && offer.chat._id) {
                        navigate(`/chat/${offer.chat._id}`);
                      } else {
                        alert("Chat not found for this offer.");
                      }
                    }}
                    disabled={!offer.chat}
                    sx={{ bgcolor: "#007BFF", "&:hover": { bgcolor: "#0056B3" } }}
                  >
                    Start Chat
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Generic Confirmation/Error Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: 4,
            bgcolor: "white",
            boxShadow: 24,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">{modalMessage}</Typography>
          <Button onClick={() => setOpenModal(false)} variant="contained" sx={{ mt: 2 }}>
            OK
          </Button>
        </Box>
      </Modal>

      {/* Rating (Approval) Modal */}
      {selectedOfferForRating && (
        <ApprovalModal
          open={approvalModalOpen}
          onClose={() => setApprovalModalOpen(false)}
          offerId={selectedOfferForRating}
          onSubmitSuccess={handleApprovalSuccess}
        />
      )}
    </Container>
  );
};

export default Offers;
