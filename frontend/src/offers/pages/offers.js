import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import { CheckCircle, Cancel, ChatBubbleOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ApprovalModal from "../components/ApprovalModal";

const OffersPage = () => {
  const [sentOffers, setSentOffers] = useState([]);
  const [receivedOffers, setReceivedOffers] = useState([]);
  const [error, setError] = useState("");
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [selectedOfferForRating, setSelectedOfferForRating] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSentOffers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/offers/sent", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch sent offers.");
        }
        setSentOffers(data.data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchReceivedOffers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/offers/received", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch received offers.");
        }
        setReceivedOffers(data.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSentOffers();
    fetchReceivedOffers();
  }, [token]);

  const handleOpenApprovalModal = (offerId) => {
    setSelectedOfferForRating(offerId);
    setApprovalModalOpen(true);
  };

  const handleRejectOffer = async (offerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/offers/${offerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ offerStatus: "Rejected" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to reject offer.");
      // עדכון המצב בדף
      setSentOffers((prev) =>
        prev.map((offer) => (offer._id === offerId ? { ...offer, offerStatus: "Rejected" } : offer))
      );
      setReceivedOffers((prev) =>
        prev.map((offer) => (offer._id === offerId ? { ...offer, offerStatus: "Rejected" } : offer))
      );
    } catch (error) {
      alert("Error rejecting offer: " + error.message);
    }
  };

  const renderOfferCard = (offer, isSent) => (
    <Grid item xs={12} key={offer._id}>
      <Card
        sx={{
          padding: 2,
          borderRadius: 3,
          boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {offer.adId?.adTitle || "Unknown Ad"}
            </Typography>
            <Chip
              label={offer.offerStatus}
              sx={{
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
          {/* Always display sender's name */}
          <Typography variant="body2" sx={{ mt: 1 }}>
            Sender: {offer.sender?.firstName} {offer.sender?.lastName}
          </Typography>
          {/* Depending on the view, display additional info */}
          {isSent ? (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Sent to: {offer.receiver?.firstName} {offer.receiver?.lastName}
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Offer Amount: {offer.offerAmount}
            </Typography>
          )}
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            {!isSent && (
              <Button
                variant="contained"
                startIcon={<CheckCircle />}
                onClick={() => handleOpenApprovalModal(offer._id)}
                sx={{ bgcolor: "#28A745", "&:hover": { bgcolor: "#218838" } }}
              >
                Accept
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<Cancel />}
              onClick={() => handleRejectOffer(offer._id)}
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
                  alert("Chat not available");
                }
              }}
              sx={{ bgcolor: "#007BFF", "&:hover": { bgcolor: "#0056B3" } }}
            >
              Chat
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
  
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        My Offers
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
        Sent Offers
      </Typography>
      <Grid container spacing={3}>
        {sentOffers.length === 0 ? (
          <Typography>No sent offers found.</Typography>
        ) : (
          sentOffers.map((offer) => renderOfferCard(offer, true))
        )}
      </Grid>
      <Typography variant="h5" sx={{ mt: 5, mb: 2 }}>
        Received Offers
      </Typography>
      <Grid container spacing={3}>
        {receivedOffers.length === 0 ? (
          <Typography>No received offers found.</Typography>
        ) : (
          receivedOffers.map((offer) => renderOfferCard(offer, false))
        )}
      </Grid>
      {selectedOfferForRating && (
        <ApprovalModal
          open={approvalModalOpen}
          onClose={() => setApprovalModalOpen(false)}
          offerId={selectedOfferForRating}
          onSubmitSuccess={() => {
            // ניתן להוסיף לוגיקה לרענון ההצעות במידה ויש צורך
            setApprovalModalOpen(false);
          }}
        />
      )}
    </Container>
  );
};

export default OffersPage;
