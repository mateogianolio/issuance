(function () {
  'use strict';

  // authenticate with github
  window.ghAuth = function () {
    var cookies = getCookies(),
        username = cookies.username,
        password = cookies.password;

    // export API as global
    window.github = new Github({
      username: cookies.username,
      password: cookies.password,
      auth: 'basic'
    });

    var user = window.github.getUser();
    user.show(cookies.username, function (error, user) {
      if (error) {
        // use personal access token if authentication throws error
        window.github = new Github({
          token: window.TOKEN,
          auth: 'oauth'
        });

        // clear cookies
        setCookie('username', '', 0);
        setCookie('password', '', 0);
      }

      // render
      window.github
        .getIssues(window.USERNAME, window.REPO)
        .list({}, window.ghRender);
    });
  };

  // called on login form submit
  window.ghLogin = function (event) {
    event.preventDefault();

    var form = document.querySelector('.login'),
        username = form.username.value,
        password = form.password.value;

    if (!username || !password)
      return false;

    setCookie('username', username);
    setCookie('password', password);

    // authenticate
    ghAuth();

    // prevent default event
    return false;
  };
}());
