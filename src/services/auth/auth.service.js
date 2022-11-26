
const getBearerToken = () => ('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');

const authService = {
  getAuthHeaders() {
    return {
      Authorization: `Bearer ${getBearerToken()}`,
    };
  },
};

export default authService;