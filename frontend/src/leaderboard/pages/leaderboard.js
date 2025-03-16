// frontend/src/leaderboard/pages/Leaderboard.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Stack,
  useMediaQuery,
  Box,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useTheme } from "@mui/material/styles";

// Example: Extend your badges beyond bronze/silver/gold
const badgeIcons = {
  "Bronze Contributor": <EmojiEventsIcon sx={{ color: "#cd7f32" }} />, // Bronze color
  "Silver Contributor": <EmojiEventsIcon sx={{ color: "#C0C0C0" }} />, // Silver color
  "Gold Contributor":   <EmojiEventsIcon sx={{ color: "#FFD700" }} />, // Gold color
  "Platinum Contributor": <EmojiEventsIcon sx={{ color: "#E5E4E2" }} />, // Platinum
  "Diamond Contributor":  <EmojiEventsIcon sx={{ color: "#B9F2FF" }} />, // Diamond
  // ... add more if needed
};

// If no badge is assigned in the backend, default to Bronze
const defaultBadge = {
  name: "Bronze Contributor",
  icon: <EmojiEventsIcon sx={{ color: "#cd7f32" }} />,
};

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); 
  // isMobile = true if screen width <= "sm" breakpoint (600px by default)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/leaderboard");
        const data = await response.json();
        if (response.ok) {
          setUsers(data.data);
        } else {
          console.error("Failed to fetch leaderboard:", data.message);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <Container
      maxWidth="xl"
      sx={{
        minHeight: "100vh",
        py: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Typography
        variant={isMobile ? "h4" : "h3"}
        fontWeight="bold"
        align="center"
        gutterBottom
        sx={{ textTransform: "uppercase" }}
      >
        Leaderboard
      </Typography>

      <Paper
        sx={{
          p: isMobile ? 1 : 2,
          overflowX: "auto", // for horizontal scroll on small screens
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#1976d2",
                "& > th": {
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                },
              }}
            >
              <TableCell>Rank</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Rating Points</TableCell>
              <TableCell>Badge</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user, index) => {
              const rank = index + 1;

              // If user has no badges or an empty array, default to Bronze
              let assignedBadge = defaultBadge; 
              if (user.badges && user.badges.length > 0) {
                const badgeName = user.badges[0].name; // e.g. "Gold Contributor"
                assignedBadge = {
                  name: badgeName,
                  icon: badgeIcons[badgeName] || defaultBadge.icon,
                };
              }

              return (
                <TableRow
                  key={user._id || index}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    {rank}
                  </TableCell>

                  <TableCell align="center" sx={{ fontWeight: "medium" }}>
                    {user.firstName} {user.lastName}
                  </TableCell>

                  <TableCell align="center" sx={{ fontWeight: "medium" }}>
                    {user.ratingPoints}
                  </TableCell>

                  <TableCell align="center">
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="center"
                    >
                      {assignedBadge.icon}
                      <Typography variant="body1">{assignedBadge.name}</Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
