(function () {
  'use strict';

  window.getCookies = function () {
    var cookies = {};
    document.cookie
      .replace(' ', '')
      .split(';')
      .forEach(function (cookie) {
        var entry = cookie.split('=');
        cookies[entry[0]] = entry[1];
      });

    return cookies;
  };

  window.setCookie = function (key, value) {
    var expires = new Date(Date.now() + (value === '' ? -1 : 60 * 60 * 1000));
    document.cookie = key + '=' + value + '; expires=' + expires;
  };
}());
