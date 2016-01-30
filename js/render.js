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
    if (issue.user.login !== window.USERNAME)
      return;

    var parent = document.querySelector('.threads'),
        container = document.createElement('div'),
        h1 = document.createElement('h1'),
        link = document.createElement('a'),
        p = document.createElement('p'),
        comments = document.createElement('a');

    parent.appendChild(container);
    container.appendChild(h1);
    link.appendChild(document.createTextNode(issue.title));
    h1.appendChild(link);

    if (issue.body) {
      container.appendChild(p);
      p.innerHTML = marked(issue.body);
    }

    container.appendChild(comments);
    comments.appendChild(document.createTextNode(issue.comments + ' comment(s)'));

    container.appendChild(document.createTextNode(', posted ' + new Date(issue.created_at).toLocaleDateString()));

    // attribs
    container.setAttribute('id', issue.id);
    link.setAttribute('href', issue.html_url);
    comments.setAttribute('href', issue.html_url);
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
