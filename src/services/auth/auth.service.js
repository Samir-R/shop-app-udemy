const getBearerToken = () => {
  // Récupérer le token depuis le localStorage
  const token = localStorage.getItem('customer_token');
  return token || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'; // Fallback au token hardcodé
};

const authService = {
  getAuthHeaders() {
    return {
      Authorization: `Bearer ${getBearerToken()}`,
    };
  },
};

export default authService;