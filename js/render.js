(function () {
  'use strict';

  // default sorting order
  function order(a, b) {
    return a.updatedAt < b.updatedAt ?
      1 : a.updatedAt === b.updatedAt ?
      0 : -1;
  }

  function html(type, content) {
    var element = document.createElement(type);
    if (content instanceof HTMLElement)
      element.appendChild(content);
    else if (content)
      element.innerHTML = content;
    return element;
  }

  function link(href, content) {
    var element = html('a', content);
    element.href = href;
    return element;
  }

  // generates html from a github issue
  function generate(issue) {
    // skip issues from other users than yourself
    if (issue.user.login !== window.USERNAME)
      return;

    var parent = document.querySelector('.threads'),
        container = html('div');

    container.className = 'post';

    parent.appendChild(container);

    var title = html('h1', link(issue.html_url, issue.title));
    title.className = 'post-title';
    container.appendChild(title);

    var categories = html('div');
    categories.className = 'post-meta-categories';
    title.appendChild(categories);

    issue.labels.forEach(function (label) {
      var element = html('span', label.name);
      element.className = 'post-meta-category';
      element.style.background = '#' + label.color;
      categories.appendChild(element);
    });

    var date = html('div', new Date(issue.created_at).toLocaleDateString());
    date.className = 'post-meta-date';
    container.appendChild(date);

    var body = html('div', marked(issue.body));
    body.className = 'post-body';
    container.appendChild(body);

    var comments = html('div');
    comments.className = 'post-comments';
    container.appendChild(comments);

    if (issue.comments) {
      var count = html('div', 'Loading ' + issue.comments + ' comment(s)...');
      comments.appendChild(count);

      window.github._request(
        'GET',
        issue.comments_url,
        {},
        function (error, data) {
          if (error)
            return;

          comments.innerHTML = '';

          data.forEach(function(comment) {
            var element = html('div');
            element.id = comment.id;
            element.className = 'post-comment';
            comments.appendChild(element);

            var author = html('div', link(comment.user.html_url, comment.user.login));
            author.className = 'post-comment-author';
            element.appendChild(author);

            var date = html('span', new Date(comment.created_at).toLocaleDateString());
            date.className = 'post-comment-date';
            author.appendChild(date);

            var body = html('div', marked(comment.body));
            body.className = 'post-comment-body';
            element.appendChild(body);
          });

          comments.appendChild(link(issue.html_url, 'add comment'));
        }
      );
    }

    // attribs
    container.id = issue.id;
    link.href = issue.html_url;
    comments.href = issue.html_url;
  }

  // renders github issues
  window.render = function () {
    window.github
      .getIssues(window.USERNAME, window.REPO)
      .list({}, function (error, issues) {
        if (error || !issues)
          return;

        document.querySelector('.threads').innerHTML = '';
        issues
          .sort(order)
          .forEach(generate);
      });
  };
}());
