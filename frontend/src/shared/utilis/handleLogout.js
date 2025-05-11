// frontend/src/shared/utils/handleLogout.js
export const handleLogout = (navigate) => {

  localStorage.removeItem('token'); 

  navigate('/login'); 

};
