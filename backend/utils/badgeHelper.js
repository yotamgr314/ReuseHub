module.exports.updateUserBadge = async (user) => {
    // Define thresholds and corresponding badges
    const thresholds = [
      { points: 10, badge: { name: "Bronze Contributor", description: "Reached 10 points", icon: "https://example.com/bronze.png" } },
      { points: 20, badge: { name: "Silver Contributor", description: "Reached 20 points", icon: "https://example.com/silver.png" } },
      { points: 30, badge: { name: "Gold Contributor", description: "Reached 30 points", icon: "https://example.com/gold.png" } }
    ];
  
    let newBadge = null;
    thresholds.forEach(threshold => {
      if (user.ratingPoints >= threshold.points) {
        newBadge = threshold.badge;
      }
    });
  
    if (newBadge) {
      // Replace the user's badges array with the latest badge (or add to it if desired)
      user.badges = [newBadge];
      await user.save();
    }
  };
  