(function () {
  'use strict';

  // authenticate with github
  window.authorize = function () {
    // TODO: if cookie[token] set window.token to cookie[token]
    
    // export API as global
    window.github = new Github({
      token: window.TOKEN,
      auth: 'oauth'
    });
  };
}());
