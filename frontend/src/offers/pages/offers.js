import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Stack,
  Button,
  Modal,
  Box,
} from "@mui/material";
import { CheckCircle, Cancel, ChatBubbleOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
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

        if (!response.ok) throw new Error(responseData.message || "Failed to fetch offers.");

        setOffers(responseData.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchOffers();
  }, [token]);

  const handleApproveOffer = async (offerId, adId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/offers/${offerId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userWhoMadeTheOfferApproval: true }),
      });

      const data = await response.json();
      console.log("✅ Offer approved:", data);

      if (!response.ok) throw new Error(data.message || "Failed to approve offer.");

      // Remove the approved offer and its associated ad
      setOffers((prevOffers) => prevOffers.filter((offer) => offer._id !== offerId && offer.adId?._id !== adId));

      setModalMessage("Offer approved successfully!");
      setOpenModal(true);
    } catch (error) {
      setModalMessage(`Error: ${error.message}`);
      setOpenModal(true);
    }
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
              {/* Left Side - Image Fix Applied */}
 
              {/* Right Side - Details */}
              <CardContent sx={{ flex: 1, ml: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#2C3E50" }}>
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

                {/* Offer Message */}
                <Typography variant="body2" sx={{ mt: 1, color: "#555" }}>
                  <strong>Message:</strong>{" "}
                  {offer.chat?.messages?.length > 0 ? offer.chat.messages[0].text : "No message sent"}
                </Typography>

                {/* Action Buttons */}
                <Stack direction="row" spacing={2} justifyContent="flex-start" sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<CheckCircle />}
                    sx={{
                      bgcolor: "#28A745",
                      "&:hover": { bgcolor: "#218838" },
                      borderRadius: 20,
                      textTransform: "none",
                    }}
                    onClick={() => handleApproveOffer(offer._id, offer.adId?._id)}
                  >
                    Approve
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<Cancel />}
                    sx={{
                      bgcolor: "#DC3545",
                      "&:hover": { bgcolor: "#C82333" },
                      borderRadius: 20,
                      textTransform: "none",
                    }}
                    onClick={() => handleRejectOffer(offer._id)}
                    disabled={offer.offerStatus === "Rejected"}
                  >
                    Reject
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<ChatBubbleOutline />}
                    sx={{
                      bgcolor: "#007BFF",
                      "&:hover": { bgcolor: "#0056B3" },
                      borderRadius: 20,
                      textTransform: "none",
                    }}
                    onClick={() => {
                      console.log("🔗 Navigating to chat:", offer.chat?._id);
                      if (offer.chat && offer.chat._id) {
                        navigate(`/chat/${offer.chat._id}`);
                      } else {
                        alert("Chat not found for this offer.");
                      }
                    }}
                    disabled={!offer.chat}
                  >
                    Start Chat
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Confirmation Modal */}
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
    </Container>
  );
};

export default Offers;
