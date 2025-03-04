const AuthService = (function() {
  
  function setToken(token, remember) {
    let storage = sessionStorage;
    if (remember) storage = localStorage;
    storage.setItem('event_token', token);
  }
  
  function getToken() {
    return localStorage.getItem('event_token') || sessionStorage.getItem('event_token');
  }
  
  function clearToken() {
    localStorage.removeItem('event_token');
    sessionStorage.removeItem('event_token');
  }

  function isAuthenticated() {
    return !!getToken();
  }

  function getUserId() {
    const token = getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  function logout() {
    clearToken();
  }
  
  return {
    setToken,
    getToken,
    clearToken,
    isAuthenticated,
    getUserId,
    logout,
  }
    
})();

export default AuthService;