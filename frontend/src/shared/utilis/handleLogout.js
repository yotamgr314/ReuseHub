// frontend/src/shared/utils/handleLogout.js
export const handleLogout = (navigate) => {

    localStorage.removeItem('token'); // removes the jwt token from the local storage - other wise it will stay there even if we close the chrome. 
  
    navigate('/login'); //  render the login page using React Router navigate()

  };
  