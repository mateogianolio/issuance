(function () {
  'use strict';

  // authenticate with github
  window.authorize = function (username, password) {
    if (username && password) {
      window.github = new Github({
        username: username,
        password: password,
      });

      return;
    }
    // export API as global
    window.github = new Github({
      token: window.TOKEN,
      auth: 'oauth'
    });
  };

  function createMessage(message, success) {
    var element = document.createElement('div');
    element.className = success ? 'progress-success' : 'progress-error';
    element.appendChild(document.createTextNode(message));
    return element;
  }

  window.login = function () {
    var form = document.querySelector('form'),
        progress = document.querySelector('.progress');

    progress.innerHTML = '';
    authorize(form.username.value, form.password.value);
    github
      .getRepo(window.USERNAME, window.REPO)
      .fork(function (error) {
        if (error)
          return progress.appendChild(createMessage('Error: Could not perform fork.'));

        progress.appendChild(createMessage(
          'Successfully forked ' + window.USERNAME + '/' + window.REPO + ' to ' +
          form.username.value + '/' + window.REPO + '.', true));

        // create personal access token with no scope
        github._request('POST', '/authorizations', { note: 'Openblog' }, function (error, response) {
          if (error)
            return progress.appendChild(createMessage('Error: Could not create personal access token.'));

          progress.appendChild(createMessage('Created personal access token.', true));

          var globals =
            '(function () {' +
              '"use strict";' +
              'window.USERNAME="' + form.username.value + '";' +
              'window.REPO="openblog";' +
              'window.TOKEN="' + response.token + '"' +
            '}());';

          github
            .getRepo(form.username.value, 'openblog')
            .write('gh-pages', 'js/globals.js', globals, 'upd globals', {}, function (error) {
              if (error) {
                progress.appendChild(createMessage(error));
                return;
              }

              var message = createMessage('Your blog is ready at ', true);
              var url = document.createElement('a');
              url.href = 'https://' + form.username.value + '.github.io/openblog/';
              url.innerHTML = url.href;
              message.appendChild(url);

              progress.appendChild(message);
            });
        });
      });
    return false;
  };
}());
