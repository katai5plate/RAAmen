"use strict";

/*:
 * @plugindesc testtest
 *
 * @help
 * Hey, Guys!
 */
(function () {
  var x = function x(y) {
    return function (z) {
      return "".concat(y).concat(z);
    };
  };

  console.log(x(1)(2));
})();