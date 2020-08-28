// import firebase from 'firebase';

/**
 * Auth helper class that manages auth user state (logged in or logged out)
 */
class Auth {
  constructor() {
    this.authenticated = false;
  }

  /**
   * Set authenticated to true and execute callback function
   * @param {Function} cb Function to be executed
   */
  login() {
    // firebase.auth()
    this.authenticated = true;
    return;
  }

  /**
   * Set authenticated to false and execute callback function
   * @param {Function} cb Function to be executed
   */
  logout() {
    // firebase.auth().signOut()
    this.authenticated = false;
    return;
  }

  /**
   * @returns {Bool} Current auth user state
   */
  isAuthenticated() {
    return this.authenticated;
  }
}

export default new Auth();
