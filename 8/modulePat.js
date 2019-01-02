var Module = Module || {};
(function(_Module) {
  var name = "NoName"; // private variable
  function getName() {
    return name;
  }
  _Module.showName = function() {
    console.log(getName());
  };
  _Module.setName = function(x) {
    name = x;
  };
})(Module);
Module.setName('Tom');
Module.showName(); // Tom