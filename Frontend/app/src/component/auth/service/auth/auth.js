const AuthService = (function() {
  
  function setToken(item, remember) {
    let storage = sessionStorage;
    if (remember) storage = localStorage;
    storage.setItem('event', JSON.stringify(item));
  }
  
  function getToken() {
    const token = localStorage.getItem('event') || sessionStorage.getItem('event');
    return token ? JSON.parse(token) : null;
  }
  
  function clearToken() {
    localStorage.removeItem('event');
    sessionStorage.removeItem('event');
  }

  function isAuthenticated() {
    return !!getToken();
  }

  function getUserId() {
    const token = getToken();
    return token && token.user ? token.user.id : null;
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