(function () {
  'use strict';

  // default sorting order
  function order(a, b) {
    return a.updatedAt < b.updatedAt ?
      1 : a.updatedAt === b.updatedAt ?
      0 : -1;
  }

  // generates html from a github issue
  window.ghGenerate = function (issue) {
    github._request(
      'GET',
      issue.comments_url,
      {},
      function (error, comments) {
        var body = '';
        body += '<div id="' + issue.id + '">';
        body += '<h1><a href="' + issue.html_url + '">' + issue.title + '</a></h1>';
        body += issue.body ? '<p>' + issue.body + '</p>' : '';

        comments.forEach(function (comment) {
          body += '<span class="comment">@' + comment.user.login + ': ' + comment.body + '</span>';
        });

        body += '<input name="comment" placeholder="write comment...">';
        body += '</div>';

        document.querySelector('.threads').innerHTML += body;
      }
    );
  };

  // renders github issues
  window.ghRender = function (error, issues) {
    if (error || !issues)
      return;

    document.querySelector('.threads').innerHTML = '';
    issues
      .sort(order)
      .forEach(window.ghGenerate);
  };
}());
