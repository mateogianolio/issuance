(function () {
  'use strict';

  var USERNAME = 'mateogianolio', // github username
      REPO = 'issue-forum', // github repository
      TOKEN = '46ff05f8cb08cc99a4e33dc49afa3bfa7505788e'; // github access token

  function getCookies() {
    var cookies = {};
    document.cookie
      .replace(' ', '')
      .split(';')
      .forEach(function (cookie) {
        var entry = cookie.split('=');
        cookies[entry[0]] = entry[1];
      });

    return cookies;
  }

  function setCookie(key, value) {
    var expires = new Date(Date.now() + (value === '' ? -1 : 60 * 60 * 1000));
    document.cookie = key + '=' + value + '; expires=' + expires;
  }

  // default sorting order
  function order(a, b) {
    return a.updatedAt < b.updatedAt ?
      1 : a.updatedAt === b.updatedAt ?
      0 : -1;
  }

  // generates html from a github issue
  function generate(issue) {
    github._request(
      'GET',
      '/repos/mateogianolio/issue-forum/issues/1/comments',
      {},
      function (error, comments) {
        var body = '';
        body += '<div id="' + issue.id + '">';
        body += '<h1><a href="' + issue.html_url + '">' + issue.title + '</a></h1>';
        body += issue.body ? '<p>' + issue.body + '</p>' : '';

        comments.forEach(function (comment) {
          body += '<span class="comment">@' + comment.user.login + ': ' + comment.body + '</span>';
        });

        body += '<input name="comment" placeholder="comment">';
        body += '</div>';

        document.querySelector('.threads').innerHTML += body;
      }
    );
  }

  // renders github issues
  function render(error, issues) {
    if (error || !issues)
      return;

    document.querySelector('.threads').innerHTML = '';
    issues
      .sort(order)
      .forEach(generate);
  }

  // authenticate with github
  window.auth = function () {
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
          token: TOKEN,
          auth: 'oauth'
        });

        // clear cookies
        setCookie('username', '', 0);
        setCookie('password', '', 0);

        document.querySelector('.login').style.display = 'block';
      } else {
        document.querySelector('.login').style.display = 'none';
      }

      // render
      window.github
        .getIssues(USERNAME, REPO)
        .list({}, render);
    });
  };

  // called on login form submit
  window.login = function () {
    var form = document.querySelector('.login'),
        username = form.username.value,
        password = form.password.value;

    if (!username || !password)
      return false;

    setCookie('username', username);
    setCookie('password', password);

    // authenticate
    auth();

    // prevent default event
    return false;
  };
}());
