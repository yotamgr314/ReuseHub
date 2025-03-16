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
  Tabs,
  Tab,
  Box
} from "@mui/material";
import { CheckCircle, Cancel, ChatBubbleOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ApprovalModal from "../components/ApprovalModal";

const OffersPage = () => {
  const [sentOffers, setSentOffers] = useState([]);
  const [receivedOffers, setReceivedOffers] = useState([]);
  const [activeTab, setActiveTab] = useState(0); // לשונית פעילה (0 = Sent, 1 = Received)
  const [error, setError] = useState("");
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [selectedOfferForRating, setSelectedOfferForRating] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // קריאה ל-API להבאת ההצעות
  useEffect(() => {
    if (!token) return;

    const fetchSentOffers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/offers/sent", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch sent offers");
        setSentOffers(data.data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchReceivedOffers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/offers/received", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch received offers");
        setReceivedOffers(data.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSentOffers();
    fetchReceivedOffers();
  }, [token]);

  // החלפת טאב
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // פתיחת מודל לאישור והענקת דירוג
  const handleOpenApprovalModal = (offerId) => {
    setSelectedOfferForRating(offerId);
    setApprovalModalOpen(true);
  };

  // דוגמה לדחיית הצעה
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

      // עדכון במצב המקומי (סינון/מיפוי)
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

  // פונקציית עזר לרינדור כרטיס הצעה
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

          {/* הצגת שם השולח */}
          <Typography variant="body2" sx={{ mt: 1 }}>
            Sender: {offer.sender?.firstName} {offer.sender?.lastName}
          </Typography>

          {/* אם זה SENT נציג למי שלחנו, ואם זה RECEIVED נציג סכום הצעה וכו' */}
          {isSent ? (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Sent to: {offer.receiver?.firstName} {offer.receiver?.lastName}
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Offer Amount: {offer.offerAmount}
            </Typography>
          )}

          {/* כפתורים */}
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            {/* כפתור ACCEPT רק ב-RECEIVED */}
            {!isSent && offer.offerStatus === "Pending" && (
              <Button
                variant="contained"
                startIcon={<CheckCircle />}
                onClick={() => handleOpenApprovalModal(offer._id)}
                sx={{ bgcolor: "#28A745", "&:hover": { bgcolor: "#218838" } }}
              >
                Accept
              </Button>
            )}
            {/* כפתור Reject */}
            {offer.offerStatus === "Pending" && (
              <Button
                variant="contained"
                startIcon={<Cancel />}
                onClick={() => handleRejectOffer(offer._id)}
                sx={{ bgcolor: "#DC3545", "&:hover": { bgcolor: "#C82333" } }}
              >
                Reject
              </Button>
            )}
            {/* כפתור צ'אט */}
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

      {/* Tabs for toggling between Sent/Received */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Sent Offers" />
          <Tab label="Received Offers" />
        </Tabs>
      </Box>

      {error && <Typography color="error">{error}</Typography>}

      {/* תצוגת Sent */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {sentOffers.length === 0 ? (
            <Typography>No sent offers found.</Typography>
          ) : (
            sentOffers.map((offer) => renderOfferCard(offer, true))
          )}
        </Grid>
      )}

      {/* תצוגת Received */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          {receivedOffers.length === 0 ? (
            <Typography>No received offers found.</Typography>
          ) : (
            receivedOffers.map((offer) => renderOfferCard(offer, false))
          )}
        </Grid>
      )}

      {/* מודל לאישור + דירוג (ApprovalModal) */}
      {selectedOfferForRating && (
        <ApprovalModal
          open={approvalModalOpen}
          onClose={() => setApprovalModalOpen(false)}
          offerId={selectedOfferForRating}
          onSubmitSuccess={() => {
            setApprovalModalOpen(false);
            // אפשר לרענן את הרשימות אם רוצים
          }}
        />
      )}
    </Container>
  );
};

export default OffersPage;
