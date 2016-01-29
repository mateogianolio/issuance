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
    var parent = document.querySelector('.threads');
    var container = document.createElement('div');
    parent.appendChild(container);

    var link = document.createElement('a');
    link.appendChild(document.createTextNode(issue.title));

    var h1 = document.createElement('h1');
    h1.appendChild(link);
    container.appendChild(h1);

    if (issue.body) {
      var p = document.createElement('p');
      p.appendChild(document.createTextNode(issue.body));
      container.appendChild(p);
    }

    var comments = document.createElement('a');
    comments.appendChild(document.createTextNode(issue.comments + ' comments'));
    container.appendChild(comments);

    container.setAttribute('id', issue.id);
    link.setAttribute('href', issue.html_url);
    comments.setAttribute('href', 'post.html#' + issue.id);
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
