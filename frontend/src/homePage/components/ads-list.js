// frontend/src/ads/components/ads-list.js
const AdsList = ({ ads }) => {
  if (!Array.isArray(ads)) 
  {
    return <p>No ads available.</p>; // Fallback message if ads is not an array
  }

  return (
    <ul>
      {ads.map((ad) => (
        <li key={ad._id || ad.title}> {/* Use fallback key if ad._id is missing */}
          <h3>{ad.title}</h3>
          <p>{ad.description}</p>
        </li>
      ))}
    </ul>
  );
};

  
  export default AdsList;
  