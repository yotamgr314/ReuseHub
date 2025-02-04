import React from "react";
import { Modal, Box, Typography, IconButton, ImageList, ImageListItem, Card, CardContent, CardMedia, Grid, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AdModalDisplay = ({ selectedAd, onClose }) => {
  if (!selectedAd) return null;

  const handleSendOffer = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          adId: selectedAd._id,
          offerAmount: 1,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send offer.");
      alert("Offer sent successfully!");
    } catch (error) {
      alert(`Error sending offer: ${error.message}`);
    }
  };

  const handleSendClaimRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          adId: selectedAd._id,
          offerAmount: 1,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send claim request.");
      alert("Claim request sent successfully!");
    } catch (error) {
      alert(`Error sending claim request: ${error.message}`);
    }
  };

  return (
    <Modal open={Boolean(selectedAd)} onClose={onClose} closeAfterTransition>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 480,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
          borderRadius: 3,
        }}
      >
        <Card sx={{ boxShadow: 3 }}>
          <CardContent sx={{ position: "relative", p: 3 }}>
            <IconButton onClick={onClose} sx={{ position: "absolute", top: 10, right: 10, color: "gray" }}>
              <CloseIcon />
            </IconButton>

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
              {selectedAd.adTitle}
            </Typography>

            <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
              {selectedAd.adDescription}
            </Typography>

            {selectedAd.kind === "donationAd" && selectedAd.items?.images?.length > 0 && (
              <ImageList cols={selectedAd.items.images.length > 1 ? 2 : 1} rowHeight={140} sx={{ mb: 2 }}>
                {selectedAd.items.images.map((imgUrl, index) => (
                  <ImageListItem key={index}>
                    <CardMedia component="img" height="140" image={imgUrl} alt={`Ad Image ${index}`} sx={{ borderRadius: 2 }} />
                  </ImageListItem>
                ))}
              </ImageList>
            )}

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Category:</strong> {selectedAd.category}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Amount:</strong> {selectedAd.amount}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Item:</strong> {selectedAd.items?.name || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Item Description:</strong> {selectedAd.items?.description || "N/A"}
                </Typography>
              </Grid>

              {selectedAd.kind === "donationAd" ? (
                <>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Condition:</strong> {selectedAd.itemCondition || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Method:</strong> {selectedAd.donationMethod || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      <strong>Status:</strong> {selectedAd.adStatus}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Button fullWidth variant="contained" color="primary" onClick={handleSendClaimRequest}>
                      Send a Claim Request
                    </Button>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      <strong>Urgency:</strong> {selectedAd.urgency}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Button fullWidth variant="contained" color="secondary" onClick={handleSendOffer}>
                      Offer to Donate
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
};

export default AdModalDisplay;
