(function () {
  'use strict';

  // authenticate with github
  window.ghAuth = function () {
    // export API as global
    window.github = new Github({
      token: window.TOKEN,
      auth: 'oauth'
    });

    // render
    window.github
      .getIssues(window.USERNAME, window.REPO)
      .list({}, window.ghRender);
  };
}());
