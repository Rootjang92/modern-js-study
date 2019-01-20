/*
주어진 이름, 속성, 자식 노드를 포함하는 ㅇ요소를 만들어서 반환하는 함수
*/

function elt(name, attributes) {
  var node = document.createElement(name);
  if (attributes) {
    for (var attr in attributes) {
      if(attributes.hasOwnProperty(attr)) {
        node.setAttribute(attr, attributes[attr]);
      }
    }
  }
  for (var i = 2; i < arguments.length; i++) {
    var child = arguments[i];
    if (typeof child == 'string') {
      child = document.createTextNode(child);
    }
    node.appendChild(child);
  }
  return node;
}