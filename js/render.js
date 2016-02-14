'use strict';

var github = new Github({
  token: TOKEN,
  auth: 'oauth'
});

// default sorting order
function order(a, b) {
  return a.updatedAt < b.updatedAt ?
    1 : a.updatedAt === b.updatedAt ?
    0 : -1;
}

// generates html from a github issue
function generate(issue) {
  // skip issues from other users than yourself
  if (issue.user.login !== window.USERNAME)
    return;

  var parent = document.querySelector('.threads'),
      content = [];

  content.push('<div id="' + issue.id + '" class="post">');
  content.push('<h1 class="post-title">');
  content.push('<a href="' + issue.html_url + '">' + issue.title + '</a>');
  content.push('</h1>');
  content.push('<div class="post-meta-categories">');
  issue.labels.forEach(function (label) {
    content.push('<span class="post-meta-category" style="background: #' + label.color + '">');
    content.push(label.name);
    content.push('</span>');
  });
  content.push('</div>');
  content.push('<div class="post-meta-date">');
  content.push(new Date(issue.created_at).toLocaleDateString());
  content.push('</div>');
  content.push('<div class="post-body" onclick="this.classList.toggle(\'active\');">');
  content.push(marked(issue.body));
  content.push('</div>');
  content.push('</div>');

  parent.innerHTML += content.join('');

  if (issue.comments) {
    var commentContainer = document.createElement('div');
    commentContainer.className = 'post-comments';
    commentContainer.innerHTML = 'Loading ' + issue.comments + ' comments...';

    parent.appendChild(commentContainer);

    github._request('GET', issue.comments_url, {}, function (error, data) {
      if (error)
        return;

      commentContainer.innerHTML = '';

      var comments = [];
      data.forEach(function (comment) {
        comments.push('<div id="' + comment.id + '" class="post-comment">');
        comments.push('<a class="post-comment-author" href="' + comment.user.html_url + '">');
        comments.push(comment.user.login);
        comments.push('</a>');
        comments.push('<span class="post-comment-date">');
        comments.push(new Date(comment.created_at).toLocaleDateString());
        comments.push('</span>');
        comments.push('<div class="post-comment-body">');
        comments.push(marked(comment.body));
        comments.push('</div>');
        comments.push('</div>');
      });

      comments.push('<a href="' + issue.html_url + '">add comment</a>');
      commentContainer.innerHTML += comments.join('');
    });
  }
}

// renders github issues
function render() {
  github
    .getIssues(USERNAME, REPO)
    .list({}, function (error, issues) {
      if (error || !issues)
        return;

      document.querySelector('.threads').innerHTML = '';
      issues.sort(order).forEach(generate);
    });
}
