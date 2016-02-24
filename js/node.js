(function () {
  'use strict';

  function Node(name, attributes) {
    this.name = name;

    if (name === 'text') {
      this.text = attributes;
      return;
    }

    this.attributes = attributes;
    this.children = [];
    this.parent = null;
  }

  Node.prototype.append = function (node, attributes) {
    this.parent = this;
    this.children.push(node instanceof Node ? node : new Node('text', node));
    return this;
  };

  Node.prototype.toString = function (node) {
    if (node === undefined)
      node = this;

    if (node.name === 'text')
      return node.text;

    var out = [node.name];
    for (var key in node.attributes)
      if (node.attributes.hasOwnProperty(key))
        out.push(key + '="' + node.attributes[key] + '"');

    out = ['<' + out.join(' ') + '>'];
    for (var child of node.children)
      out.push(this.toString(child));

    return out.join('') + '</' + node.name + '>';
  };

  window.Node = Node;
}());
