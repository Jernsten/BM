"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.find = find;exports.sanityCheck = exports.main = exports.Tree = exports.Node = exports.Bottle = void 0;
var _art = require("./art");function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var

Bottle = /*#__PURE__*/function () {
  function Bottle(volume) {_classCallCheck(this, Bottle);
    this.volume = volume;
    this.content = 0;
    // if this bottle has the desired measure
    this.isTargeted = false;
  }_createClass(Bottle, [{ key: "fillUp", value: function fillUp()

    {
      this.content = this.volume;
      return this;
    } }, { key: "pourOut", value: function pourOut()

    {
      this.content = 0;
      return this;
    } }, { key: "pourOverTo", value: function pourOverTo(

    otherBottle) {
      var canPour = this.content;
      var canFit = otherBottle.volume - otherBottle.content;
      // cant fit anymore or nothing to pour over
      if (canFit == 0 || canPour == 0) return;
      // else
      var amountToPour = canFit <= canPour ? canFit : canPour;
      otherBottle.content += amountToPour;
      this.content -= amountToPour;
    } }, { key: "hasRoom", value: function hasRoom()

    {
      return this.volume - this.content > 0;
    } }, { key: "isNotEmpty", value: function isNotEmpty()

    {
      return this.content > 0;
    } }, { key: "isEmpty", value: function isEmpty()

    {
      return this.content == 0;
    } }, { key: "isFull", value: function isFull()

    {
      return this.content == this.volume;
    } }, { key: "add", value: function add(

    some) {
      this.content += some;
      return this;
    } }, { key: "take", value: function take(

    some) {
      this.content -= some;
      return this;
    } }, { key: "copy", value: function copy()

    {
      return new Bottle(this.volume).add(this.content);
    } }, { key: "hasBeenTargeted", value: function hasBeenTargeted()

    {
      return this.isTargeted;
    } }]);return Bottle;}();exports.Bottle = Bottle;var


Node = /*#__PURE__*/function () {
  function Node(leftBottle, rightBottle) {_classCallCheck(this, Node);
    this.left = leftBottle;
    this.right = rightBottle;
    this.parent = null;
    this.children = [];

    // The literal beginnings, will be overriten except for root node
    this.previousAction = '\n ___' + leftBottle.volume + '_____' +
    rightBottle.volume + '___  Take two empty bottles of ' +
    leftBottle.volume + ' and ' + rightBottle.volume + ' liters';
  }_createClass(Node, [{ key: "fillPourOrTransfer", value: function fillPourOrTransfer()

    {
      var parents = this;

      var preConditions = {
        fillLeft: function fillLeft() {return parents.left.hasRoom();},
        pourLeft: function pourLeft() {return parents.left.isNotEmpty();},
        pourFromLeftToRight: function pourFromLeftToRight() {return parents.left.isNotEmpty() && parents.right.hasRoom();},
        pourFromRightToLeft: function pourFromRightToLeft() {return parents.right.isNotEmpty() && parents.left.hasRoom();},
        pourRight: function pourRight() {return parents.right.isNotEmpty();},
        fillRight: function fillRight() {return parents.right.hasRoom();} };


      var story = {
        fillLeft: function fillLeft() {return ' fill up the left bottle';},
        pourLeft: function pourLeft() {return ' pour out the left bottle';},
        pourFromLeftToRight: function pourFromLeftToRight() {return ' pour from the left bottle to the right bottle';},
        pourFromRightToLeft: function pourFromRightToLeft() {return ' pour from the right bottle to the left bottle';},
        pourRight: function pourRight() {return ' pour out the right bottle';},
        fillRight: function fillRight() {return ' fill up the right bottle';} };


      for (var whatsPossible in preConditions) {
        if (preConditions[whatsPossible]()) {
          var child = parents.createChild(story[whatsPossible]);
          if (!this.bothBottlesFullOrEmpty(child)) {
            this.children.push(child);
          }
        }
      }
    } }, { key: "bothBottlesFullOrEmpty", value: function bothBottlesFullOrEmpty(
    child) {
      return child.left.isFull() && child.right.isFull() ||
      child.left.isEmpty() && child.right.isEmpty();
    } }, { key: "createChild", value: function createChild(
    howImMade) {
      var left = this.left.copy(),right = this.right.copy();

      switch (howImMade.name) {
        case 'fillLeft':
          left.fillUp();
          break;
        case 'pourLeft':
          left.pourOut();
          break;
        case 'pourFromLeftToRight':
          left.pourOverTo(right);
          break;
        case 'pourFromRightToLeft':
          right.pourOverTo(left);
          break;
        case 'pourRight':
          right.pourOut();
          break;
        case 'fillRight':
          right.fillUp();
          break;}

      var child = new Node(left, right);
      child.parent = this;
      child.previousAction = ' |  ' + left.content + '  |  ' + right.content + '  | ' + howImMade();
      return child;
    } }, { key: "describeActions", value: function describeActions()

    {
      var actions = [];
      var node = this;
      while (node != null) {
        actions.unshift(node.previousAction);
        node = node.parent;
      }

      var sentence = actions.join(',\n');
      return this.finish(sentence);
    } }, { key: "finish", value: function finish(

    sentence) {
      var measure = this.getTargetedBottle().content;
      var side = this.left.hasBeenTargeted() ? 'left' : 'right';
      var lastPart = ' and\n     DONE!      you have ' +
      measure + ' liters in the ' +
      side + ' bottle.';
      return sentence + lastPart;
    } }, { key: "getTargetedBottle", value: function getTargetedBottle()

    {
      return this.left.hasBeenTargeted() ? this.left : this.right;
    } }]);return Node;}();exports.Node = Node;var


Tree = /*#__PURE__*/function () {
  function Tree(leftBottle, rightBottle) {_classCallCheck(this, Tree);
    this.node = new Node(leftBottle, rightBottle);
    this.root = this.node;
  }_createClass(Tree, [{ key: "traverseBreadthFirst", value: function traverseBreadthFirst(

    itIsDesired) {
      // create queue with root node
      var queue = [this.root];
      // dequeue root node
      var currentNode = queue.shift();

      while (currentNode) {
        if (itIsDesired(currentNode)) {
          return currentNode;
        }
        // if not the desired node, queque children
        var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {for (var _iterator = currentNode.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var child = _step.value;
            queue.push(child);
          }
          // dequeue next node to look at
        } catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator["return"] != null) {_iterator["return"]();}} finally {if (_didIteratorError) {throw _iteratorError;}}}currentNode = queue.shift();
      }
    } }, { key: "grow", value: function grow()

    {
      this.node.fillPourOrTransfer();
      return this;
    } }, { key: "getNode", value: function getNode(

    thatHasTheDesiredMeasure) {
      return this.traverseBreadthFirst(thatHasTheDesiredMeasure);
    } }]);return Tree;}();exports.Tree = Tree;



function find(desiredMeasure) {
  return function (node) {
    if (node.left.content == desiredMeasure) {
      node.left.isTargeted = true;
      return true;
    } else if (node.right.content == desiredMeasure) {
      node.right.isTargeted = true;
      return true;
    } else {
      node.fillPourOrTransfer();
      return false; // and keep looking
    }
  };
}

var printHowToGetThere = function printHowToGetThere(leftVolume, rightVolume, desiredMeasure) {
  console.log(
  new Tree(new Bottle(leftVolume), new Bottle(rightVolume)).
  getNode(find(desiredMeasure)).
  describeActions());

};

var main = function main() {
  _art.PRINT.welcome();
  _art.PRINT.measure1();
  printHowToGetThere(3, 5, 1);
  _art.PRINT.border();
  _art.PRINT.measure4();
  printHowToGetThere(3, 5, 4);
  _art.PRINT.border();
  _art.PRINT.measure8fromBottles1and20();
  printHowToGetThere(1, 20, 8);
  _art.PRINT.bye();
};exports.main = main;

var sanityCheck = function sanityCheck() {return 'Test is working!';};exports.sanityCheck = sanityCheck;
main();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJCb3R0bGUiLCJ2b2x1bWUiLCJjb250ZW50IiwiaXNUYXJnZXRlZCIsIm90aGVyQm90dGxlIiwiY2FuUG91ciIsImNhbkZpdCIsImFtb3VudFRvUG91ciIsInNvbWUiLCJhZGQiLCJOb2RlIiwibGVmdEJvdHRsZSIsInJpZ2h0Qm90dGxlIiwibGVmdCIsInJpZ2h0IiwicGFyZW50IiwiY2hpbGRyZW4iLCJwcmV2aW91c0FjdGlvbiIsInBhcmVudHMiLCJwcmVDb25kaXRpb25zIiwiZmlsbExlZnQiLCJoYXNSb29tIiwicG91ckxlZnQiLCJpc05vdEVtcHR5IiwicG91ckZyb21MZWZ0VG9SaWdodCIsInBvdXJGcm9tUmlnaHRUb0xlZnQiLCJwb3VyUmlnaHQiLCJmaWxsUmlnaHQiLCJzdG9yeSIsIndoYXRzUG9zc2libGUiLCJjaGlsZCIsImNyZWF0ZUNoaWxkIiwiYm90aEJvdHRsZXNGdWxsT3JFbXB0eSIsInB1c2giLCJpc0Z1bGwiLCJpc0VtcHR5IiwiaG93SW1NYWRlIiwiY29weSIsIm5hbWUiLCJmaWxsVXAiLCJwb3VyT3V0IiwicG91ck92ZXJUbyIsImFjdGlvbnMiLCJub2RlIiwidW5zaGlmdCIsInNlbnRlbmNlIiwiam9pbiIsImZpbmlzaCIsIm1lYXN1cmUiLCJnZXRUYXJnZXRlZEJvdHRsZSIsInNpZGUiLCJoYXNCZWVuVGFyZ2V0ZWQiLCJsYXN0UGFydCIsIlRyZWUiLCJyb290IiwiaXRJc0Rlc2lyZWQiLCJxdWV1ZSIsImN1cnJlbnROb2RlIiwic2hpZnQiLCJmaWxsUG91ck9yVHJhbnNmZXIiLCJ0aGF0SGFzVGhlRGVzaXJlZE1lYXN1cmUiLCJ0cmF2ZXJzZUJyZWFkdGhGaXJzdCIsImZpbmQiLCJkZXNpcmVkTWVhc3VyZSIsInByaW50SG93VG9HZXRUaGVyZSIsImxlZnRWb2x1bWUiLCJyaWdodFZvbHVtZSIsImNvbnNvbGUiLCJsb2ciLCJnZXROb2RlIiwiZGVzY3JpYmVBY3Rpb25zIiwibWFpbiIsIlBSSU5UIiwid2VsY29tZSIsIm1lYXN1cmUxIiwiYm9yZGVyIiwibWVhc3VyZTQiLCJtZWFzdXJlOGZyb21Cb3R0bGVzMWFuZDIwIiwiYnllIiwic2FuaXR5Q2hlY2siXSwibWFwcGluZ3MiOiJBQUFBLGE7QUFDQSw0Qjs7QUFFYUEsTTtBQUNULGtCQUFZQyxNQUFaLEVBQW9CO0FBQ2hCLFNBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUNBLFNBQUtDLE9BQUwsR0FBZSxDQUFmO0FBQ0E7QUFDQSxTQUFLQyxVQUFMLEdBQWtCLEtBQWxCO0FBQ0gsRzs7QUFFUTtBQUNMLFdBQUtELE9BQUwsR0FBZSxLQUFLRCxNQUFwQjtBQUNBLGFBQU8sSUFBUDtBQUNILEs7O0FBRVM7QUFDTixXQUFLQyxPQUFMLEdBQWUsQ0FBZjtBQUNBLGFBQU8sSUFBUDtBQUNILEs7O0FBRVVFLElBQUFBLFcsRUFBYTtBQUNwQixVQUFNQyxPQUFPLEdBQUcsS0FBS0gsT0FBckI7QUFDQSxVQUFNSSxNQUFNLEdBQUdGLFdBQVcsQ0FBQ0gsTUFBWixHQUFxQkcsV0FBVyxDQUFDRixPQUFoRDtBQUNBO0FBQ0EsVUFBSUksTUFBTSxJQUFJLENBQVYsSUFBZUQsT0FBTyxJQUFJLENBQTlCLEVBQWlDO0FBQ2pDO0FBQ0EsVUFBTUUsWUFBWSxHQUFHRCxNQUFNLElBQUlELE9BQVYsR0FBb0JDLE1BQXBCLEdBQTZCRCxPQUFsRDtBQUNBRCxNQUFBQSxXQUFXLENBQUNGLE9BQVosSUFBdUJLLFlBQXZCO0FBQ0EsV0FBS0wsT0FBTCxJQUFnQkssWUFBaEI7QUFDSCxLOztBQUVTO0FBQ04sYUFBUSxLQUFLTixNQUFMLEdBQWMsS0FBS0MsT0FBcEIsR0FBK0IsQ0FBdEM7QUFDSCxLOztBQUVZO0FBQ1QsYUFBTyxLQUFLQSxPQUFMLEdBQWUsQ0FBdEI7QUFDSCxLOztBQUVTO0FBQ04sYUFBTyxLQUFLQSxPQUFMLElBQWdCLENBQXZCO0FBQ0gsSzs7QUFFUTtBQUNMLGFBQU8sS0FBS0EsT0FBTCxJQUFnQixLQUFLRCxNQUE1QjtBQUNILEs7O0FBRUdPLElBQUFBLEksRUFBTTtBQUNOLFdBQUtOLE9BQUwsSUFBZ0JNLElBQWhCO0FBQ0EsYUFBTyxJQUFQO0FBQ0gsSzs7QUFFSUEsSUFBQUEsSSxFQUFNO0FBQ1AsV0FBS04sT0FBTCxJQUFnQk0sSUFBaEI7QUFDQSxhQUFPLElBQVA7QUFDSCxLOztBQUVNO0FBQ0gsYUFBTyxJQUFJUixNQUFKLENBQVcsS0FBS0MsTUFBaEIsRUFBd0JRLEdBQXhCLENBQTRCLEtBQUtQLE9BQWpDLENBQVA7QUFDSCxLOztBQUVpQjtBQUNkLGFBQU8sS0FBS0MsVUFBWjtBQUNILEs7OztBQUdRTyxJO0FBQ1QsZ0JBQVlDLFVBQVosRUFBd0JDLFdBQXhCLEVBQXFDO0FBQ2pDLFNBQUtDLElBQUwsR0FBWUYsVUFBWjtBQUNBLFNBQUtHLEtBQUwsR0FBYUYsV0FBYjtBQUNBLFNBQUtHLE1BQUwsR0FBYyxJQUFkO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQixFQUFoQjs7QUFFQTtBQUNBLFNBQUtDLGNBQUwsR0FBc0IsV0FBV04sVUFBVSxDQUFDVixNQUF0QixHQUErQixPQUEvQjtBQUNoQlcsSUFBQUEsV0FBVyxDQUFDWCxNQURJLEdBQ0ssaUNBREw7QUFFaEJVLElBQUFBLFVBQVUsQ0FBQ1YsTUFGSyxHQUVJLE9BRkosR0FFY1csV0FBVyxDQUFDWCxNQUYxQixHQUVtQyxTQUZ6RDtBQUdILEc7O0FBRW9CO0FBQ2pCLFVBQU1pQixPQUFPLEdBQUcsSUFBaEI7O0FBRUEsVUFBTUMsYUFBYSxHQUFHO0FBQ2xCQyxRQUFBQSxRQUFRLEVBQUUsNEJBQU1GLE9BQU8sQ0FBQ0wsSUFBUixDQUFhUSxPQUFiLEVBQU4sRUFEUTtBQUVsQkMsUUFBQUEsUUFBUSxFQUFFLDRCQUFNSixPQUFPLENBQUNMLElBQVIsQ0FBYVUsVUFBYixFQUFOLEVBRlE7QUFHbEJDLFFBQUFBLG1CQUFtQixFQUFFLHVDQUFNTixPQUFPLENBQUNMLElBQVIsQ0FBYVUsVUFBYixNQUE2QkwsT0FBTyxDQUFDSixLQUFSLENBQWNPLE9BQWQsRUFBbkMsRUFISDtBQUlsQkksUUFBQUEsbUJBQW1CLEVBQUUsdUNBQU1QLE9BQU8sQ0FBQ0osS0FBUixDQUFjUyxVQUFkLE1BQThCTCxPQUFPLENBQUNMLElBQVIsQ0FBYVEsT0FBYixFQUFwQyxFQUpIO0FBS2xCSyxRQUFBQSxTQUFTLEVBQUUsNkJBQU1SLE9BQU8sQ0FBQ0osS0FBUixDQUFjUyxVQUFkLEVBQU4sRUFMTztBQU1sQkksUUFBQUEsU0FBUyxFQUFFLDZCQUFNVCxPQUFPLENBQUNKLEtBQVIsQ0FBY08sT0FBZCxFQUFOLEVBTk8sRUFBdEI7OztBQVNBLFVBQU1PLEtBQUssR0FBRztBQUNWUixRQUFBQSxRQUFRLEVBQUUsNEJBQU0sMEJBQU4sRUFEQTtBQUVWRSxRQUFBQSxRQUFRLEVBQUUsNEJBQU0sMkJBQU4sRUFGQTtBQUdWRSxRQUFBQSxtQkFBbUIsRUFBRSx1Q0FBTSxnREFBTixFQUhYO0FBSVZDLFFBQUFBLG1CQUFtQixFQUFFLHVDQUFNLGdEQUFOLEVBSlg7QUFLVkMsUUFBQUEsU0FBUyxFQUFFLDZCQUFNLDRCQUFOLEVBTEQ7QUFNVkMsUUFBQUEsU0FBUyxFQUFFLDZCQUFNLDJCQUFOLEVBTkQsRUFBZDs7O0FBU0EsV0FBSyxJQUFNRSxhQUFYLElBQTRCVixhQUE1QixFQUEyQztBQUN2QyxZQUFJQSxhQUFhLENBQUNVLGFBQUQsQ0FBYixFQUFKLEVBQW9DO0FBQ2hDLGNBQU1DLEtBQUssR0FBR1osT0FBTyxDQUFDYSxXQUFSLENBQW9CSCxLQUFLLENBQUNDLGFBQUQsQ0FBekIsQ0FBZDtBQUNBLGNBQUksQ0FBQyxLQUFLRyxzQkFBTCxDQUE0QkYsS0FBNUIsQ0FBTCxFQUF5QztBQUNyQyxpQkFBS2QsUUFBTCxDQUFjaUIsSUFBZCxDQUFtQkgsS0FBbkI7QUFDSDtBQUNKO0FBQ0o7QUFDSixLO0FBQ3NCQSxJQUFBQSxLLEVBQU87QUFDMUIsYUFBU0EsS0FBSyxDQUFDakIsSUFBTixDQUFXcUIsTUFBWCxNQUF1QkosS0FBSyxDQUFDaEIsS0FBTixDQUFZb0IsTUFBWixFQUF4QjtBQUNISixNQUFBQSxLQUFLLENBQUNqQixJQUFOLENBQVdzQixPQUFYLE1BQXdCTCxLQUFLLENBQUNoQixLQUFOLENBQVlxQixPQUFaLEVBRDdCO0FBRUgsSztBQUNXQyxJQUFBQSxTLEVBQVc7QUFDbkIsVUFBTXZCLElBQUksR0FBRyxLQUFLQSxJQUFMLENBQVV3QixJQUFWLEVBQWIsQ0FBK0J2QixLQUFLLEdBQUcsS0FBS0EsS0FBTCxDQUFXdUIsSUFBWCxFQUF2Qzs7QUFFQSxjQUFRRCxTQUFTLENBQUNFLElBQWxCO0FBQ0ksYUFBSyxVQUFMO0FBQ0l6QixVQUFBQSxJQUFJLENBQUMwQixNQUFMO0FBQ0E7QUFDSixhQUFLLFVBQUw7QUFDSTFCLFVBQUFBLElBQUksQ0FBQzJCLE9BQUw7QUFDQTtBQUNKLGFBQUsscUJBQUw7QUFDSTNCLFVBQUFBLElBQUksQ0FBQzRCLFVBQUwsQ0FBZ0IzQixLQUFoQjtBQUNBO0FBQ0osYUFBSyxxQkFBTDtBQUNJQSxVQUFBQSxLQUFLLENBQUMyQixVQUFOLENBQWlCNUIsSUFBakI7QUFDQTtBQUNKLGFBQUssV0FBTDtBQUNJQyxVQUFBQSxLQUFLLENBQUMwQixPQUFOO0FBQ0E7QUFDSixhQUFLLFdBQUw7QUFDSTFCLFVBQUFBLEtBQUssQ0FBQ3lCLE1BQU47QUFDQSxnQkFsQlI7O0FBb0JBLFVBQU1ULEtBQUssR0FBRyxJQUFJcEIsSUFBSixDQUFTRyxJQUFULEVBQWVDLEtBQWYsQ0FBZDtBQUNBZ0IsTUFBQUEsS0FBSyxDQUFDZixNQUFOLEdBQWUsSUFBZjtBQUNBZSxNQUFBQSxLQUFLLENBQUNiLGNBQU4sR0FBdUIsU0FBU0osSUFBSSxDQUFDWCxPQUFkLEdBQXdCLE9BQXhCLEdBQWtDWSxLQUFLLENBQUNaLE9BQXhDLEdBQWtELE1BQWxELEdBQTJEa0MsU0FBUyxFQUEzRjtBQUNBLGFBQU9OLEtBQVA7QUFDSCxLOztBQUVpQjtBQUNkLFVBQU1ZLE9BQU8sR0FBRyxFQUFoQjtBQUNBLFVBQUlDLElBQUksR0FBRyxJQUFYO0FBQ0EsYUFBT0EsSUFBSSxJQUFJLElBQWYsRUFBcUI7QUFDakJELFFBQUFBLE9BQU8sQ0FBQ0UsT0FBUixDQUFnQkQsSUFBSSxDQUFDMUIsY0FBckI7QUFDQTBCLFFBQUFBLElBQUksR0FBR0EsSUFBSSxDQUFDNUIsTUFBWjtBQUNIOztBQUVELFVBQU04QixRQUFRLEdBQUdILE9BQU8sQ0FBQ0ksSUFBUixDQUFhLEtBQWIsQ0FBakI7QUFDQSxhQUFPLEtBQUtDLE1BQUwsQ0FBWUYsUUFBWixDQUFQO0FBQ0gsSzs7QUFFTUEsSUFBQUEsUSxFQUFVO0FBQ2IsVUFBTUcsT0FBTyxHQUFHLEtBQUtDLGlCQUFMLEdBQXlCL0MsT0FBekM7QUFDQSxVQUFNZ0QsSUFBSSxHQUFHLEtBQUtyQyxJQUFMLENBQVVzQyxlQUFWLEtBQThCLE1BQTlCLEdBQXVDLE9BQXBEO0FBQ0EsVUFBTUMsUUFBUSxHQUFHO0FBQ1hKLE1BQUFBLE9BRFcsR0FDRCxpQkFEQztBQUVYRSxNQUFBQSxJQUZXLEdBRUosVUFGYjtBQUdBLGFBQU9MLFFBQVEsR0FBR08sUUFBbEI7QUFDSCxLOztBQUVtQjtBQUNoQixhQUFPLEtBQUt2QyxJQUFMLENBQVVzQyxlQUFWLEtBQThCLEtBQUt0QyxJQUFuQyxHQUEwQyxLQUFLQyxLQUF0RDtBQUNILEs7OztBQUdRdUMsSTtBQUNULGdCQUFZMUMsVUFBWixFQUF3QkMsV0FBeEIsRUFBcUM7QUFDakMsU0FBSytCLElBQUwsR0FBWSxJQUFJakMsSUFBSixDQUFTQyxVQUFULEVBQXFCQyxXQUFyQixDQUFaO0FBQ0EsU0FBSzBDLElBQUwsR0FBWSxLQUFLWCxJQUFqQjtBQUNILEc7O0FBRW9CWSxJQUFBQSxXLEVBQWE7QUFDOUI7QUFDQSxVQUFNQyxLQUFLLEdBQUcsQ0FBQyxLQUFLRixJQUFOLENBQWQ7QUFDQTtBQUNBLFVBQUlHLFdBQVcsR0FBR0QsS0FBSyxDQUFDRSxLQUFOLEVBQWxCOztBQUVBLGFBQU9ELFdBQVAsRUFBb0I7QUFDaEIsWUFBSUYsV0FBVyxDQUFDRSxXQUFELENBQWYsRUFBOEI7QUFDMUIsaUJBQU9BLFdBQVA7QUFDSDtBQUNEO0FBSmdCLCtHQUtoQixxQkFBb0JBLFdBQVcsQ0FBQ3pDLFFBQWhDLDhIQUEwQyxLQUEvQmMsS0FBK0I7QUFDdEMwQixZQUFBQSxLQUFLLENBQUN2QixJQUFOLENBQVdILEtBQVg7QUFDSDtBQUNEO0FBUmdCLHVPQVNoQjJCLFdBQVcsR0FBR0QsS0FBSyxDQUFDRSxLQUFOLEVBQWQ7QUFDSDtBQUNKLEs7O0FBRU07QUFDSCxXQUFLZixJQUFMLENBQVVnQixrQkFBVjtBQUNBLGFBQU8sSUFBUDtBQUNILEs7O0FBRU9DLElBQUFBLHdCLEVBQTBCO0FBQzlCLGFBQU8sS0FBS0Msb0JBQUwsQ0FBMEJELHdCQUExQixDQUFQO0FBQ0gsSzs7OztBQUlFLFNBQVNFLElBQVQsQ0FBY0MsY0FBZCxFQUE4QjtBQUNqQyxTQUFPLFVBQVVwQixJQUFWLEVBQWdCO0FBQ25CLFFBQUlBLElBQUksQ0FBQzlCLElBQUwsQ0FBVVgsT0FBVixJQUFxQjZELGNBQXpCLEVBQXlDO0FBQ3JDcEIsTUFBQUEsSUFBSSxDQUFDOUIsSUFBTCxDQUFVVixVQUFWLEdBQXVCLElBQXZCO0FBQ0EsYUFBTyxJQUFQO0FBQ0gsS0FIRCxNQUdPLElBQUl3QyxJQUFJLENBQUM3QixLQUFMLENBQVdaLE9BQVgsSUFBc0I2RCxjQUExQixFQUEwQztBQUM3Q3BCLE1BQUFBLElBQUksQ0FBQzdCLEtBQUwsQ0FBV1gsVUFBWCxHQUF3QixJQUF4QjtBQUNBLGFBQU8sSUFBUDtBQUNILEtBSE0sTUFHQTtBQUNId0MsTUFBQUEsSUFBSSxDQUFDZ0Isa0JBQUw7QUFDQSxhQUFPLEtBQVAsQ0FGRyxDQUVVO0FBQ2hCO0FBQ0osR0FYRDtBQVlIOztBQUVELElBQU1LLGtCQUFrQixHQUFHLFNBQXJCQSxrQkFBcUIsQ0FBQ0MsVUFBRCxFQUFhQyxXQUFiLEVBQTBCSCxjQUExQixFQUE2QztBQUNwRUksRUFBQUEsT0FBTyxDQUFDQyxHQUFSO0FBQ0ksTUFBSWYsSUFBSixDQUFTLElBQUlyRCxNQUFKLENBQVdpRSxVQUFYLENBQVQsRUFBaUMsSUFBSWpFLE1BQUosQ0FBV2tFLFdBQVgsQ0FBakM7QUFDS0csRUFBQUEsT0FETCxDQUNhUCxJQUFJLENBQUNDLGNBQUQsQ0FEakI7QUFFS08sRUFBQUEsZUFGTCxFQURKOztBQUtILENBTkQ7O0FBUU8sSUFBTUMsSUFBSSxHQUFHLFNBQVBBLElBQU8sR0FBWTtBQUM1QkMsYUFBTUMsT0FBTjtBQUNBRCxhQUFNRSxRQUFOO0FBQ0FWLEVBQUFBLGtCQUFrQixDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxDQUFsQjtBQUNBUSxhQUFNRyxNQUFOO0FBQ0FILGFBQU1JLFFBQU47QUFDQVosRUFBQUEsa0JBQWtCLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBQWxCO0FBQ0FRLGFBQU1HLE1BQU47QUFDQUgsYUFBTUsseUJBQU47QUFDQWIsRUFBQUEsa0JBQWtCLENBQUMsQ0FBRCxFQUFJLEVBQUosRUFBUSxDQUFSLENBQWxCO0FBQ0FRLGFBQU1NLEdBQU47QUFDSCxDQVhNLEM7O0FBYUEsSUFBTUMsV0FBVyxHQUFHLFNBQWRBLFdBQWMsV0FBTSxrQkFBTixFQUFwQixDO0FBQ1BSLElBQUkiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxuaW1wb3J0IHsgUFJJTlQgfSBmcm9tICcuL2FydCdcblxuZXhwb3J0IGNsYXNzIEJvdHRsZSB7XG4gICAgY29uc3RydWN0b3Iodm9sdW1lKSB7XG4gICAgICAgIHRoaXMudm9sdW1lID0gdm9sdW1lXG4gICAgICAgIHRoaXMuY29udGVudCA9IDBcbiAgICAgICAgLy8gaWYgdGhpcyBib3R0bGUgaGFzIHRoZSBkZXNpcmVkIG1lYXN1cmVcbiAgICAgICAgdGhpcy5pc1RhcmdldGVkID0gZmFsc2VcbiAgICB9XG5cbiAgICBmaWxsVXAoKSB7XG4gICAgICAgIHRoaXMuY29udGVudCA9IHRoaXMudm9sdW1lXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgcG91ck91dCgpIHtcbiAgICAgICAgdGhpcy5jb250ZW50ID0gMFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIHBvdXJPdmVyVG8ob3RoZXJCb3R0bGUpIHtcbiAgICAgICAgY29uc3QgY2FuUG91ciA9IHRoaXMuY29udGVudFxuICAgICAgICBjb25zdCBjYW5GaXQgPSBvdGhlckJvdHRsZS52b2x1bWUgLSBvdGhlckJvdHRsZS5jb250ZW50XG4gICAgICAgIC8vIGNhbnQgZml0IGFueW1vcmUgb3Igbm90aGluZyB0byBwb3VyIG92ZXJcbiAgICAgICAgaWYgKGNhbkZpdCA9PSAwIHx8IGNhblBvdXIgPT0gMCkgcmV0dXJuXG4gICAgICAgIC8vIGVsc2VcbiAgICAgICAgY29uc3QgYW1vdW50VG9Qb3VyID0gY2FuRml0IDw9IGNhblBvdXIgPyBjYW5GaXQgOiBjYW5Qb3VyXG4gICAgICAgIG90aGVyQm90dGxlLmNvbnRlbnQgKz0gYW1vdW50VG9Qb3VyXG4gICAgICAgIHRoaXMuY29udGVudCAtPSBhbW91bnRUb1BvdXJcbiAgICB9XG5cbiAgICBoYXNSb29tKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMudm9sdW1lIC0gdGhpcy5jb250ZW50KSA+IDBcbiAgICB9XG5cbiAgICBpc05vdEVtcHR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50ID4gMFxuICAgIH1cblxuICAgIGlzRW1wdHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQgPT0gMFxuICAgIH1cblxuICAgIGlzRnVsbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudCA9PSB0aGlzLnZvbHVtZVxuICAgIH1cblxuICAgIGFkZChzb21lKSB7XG4gICAgICAgIHRoaXMuY29udGVudCArPSBzb21lXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgdGFrZShzb21lKSB7XG4gICAgICAgIHRoaXMuY29udGVudCAtPSBzb21lXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgY29weSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCb3R0bGUodGhpcy52b2x1bWUpLmFkZCh0aGlzLmNvbnRlbnQpXG4gICAgfVxuXG4gICAgaGFzQmVlblRhcmdldGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc1RhcmdldGVkXG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTm9kZSB7XG4gICAgY29uc3RydWN0b3IobGVmdEJvdHRsZSwgcmlnaHRCb3R0bGUpIHtcbiAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdEJvdHRsZVxuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHRCb3R0bGVcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBudWxsXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXVxuXG4gICAgICAgIC8vIFRoZSBsaXRlcmFsIGJlZ2lubmluZ3MsIHdpbGwgYmUgb3ZlcnJpdGVuIGV4Y2VwdCBmb3Igcm9vdCBub2RlXG4gICAgICAgIHRoaXMucHJldmlvdXNBY3Rpb24gPSAnXFxuIF9fXycgKyBsZWZ0Qm90dGxlLnZvbHVtZSArICdfX19fXydcbiAgICAgICAgICAgICsgcmlnaHRCb3R0bGUudm9sdW1lICsgJ19fXyAgVGFrZSB0d28gZW1wdHkgYm90dGxlcyBvZiAnXG4gICAgICAgICAgICArIGxlZnRCb3R0bGUudm9sdW1lICsgJyBhbmQgJyArIHJpZ2h0Qm90dGxlLnZvbHVtZSArICcgbGl0ZXJzJ1xuICAgIH1cblxuICAgIGZpbGxQb3VyT3JUcmFuc2ZlcigpIHtcbiAgICAgICAgY29uc3QgcGFyZW50cyA9IHRoaXNcblxuICAgICAgICBjb25zdCBwcmVDb25kaXRpb25zID0ge1xuICAgICAgICAgICAgZmlsbExlZnQ6ICgpID0+IHBhcmVudHMubGVmdC5oYXNSb29tKCksXG4gICAgICAgICAgICBwb3VyTGVmdDogKCkgPT4gcGFyZW50cy5sZWZ0LmlzTm90RW1wdHkoKSxcbiAgICAgICAgICAgIHBvdXJGcm9tTGVmdFRvUmlnaHQ6ICgpID0+IHBhcmVudHMubGVmdC5pc05vdEVtcHR5KCkgJiYgcGFyZW50cy5yaWdodC5oYXNSb29tKCksXG4gICAgICAgICAgICBwb3VyRnJvbVJpZ2h0VG9MZWZ0OiAoKSA9PiBwYXJlbnRzLnJpZ2h0LmlzTm90RW1wdHkoKSAmJiBwYXJlbnRzLmxlZnQuaGFzUm9vbSgpLFxuICAgICAgICAgICAgcG91clJpZ2h0OiAoKSA9PiBwYXJlbnRzLnJpZ2h0LmlzTm90RW1wdHkoKSxcbiAgICAgICAgICAgIGZpbGxSaWdodDogKCkgPT4gcGFyZW50cy5yaWdodC5oYXNSb29tKClcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN0b3J5ID0ge1xuICAgICAgICAgICAgZmlsbExlZnQ6ICgpID0+ICcgZmlsbCB1cCB0aGUgbGVmdCBib3R0bGUnLFxuICAgICAgICAgICAgcG91ckxlZnQ6ICgpID0+ICcgcG91ciBvdXQgdGhlIGxlZnQgYm90dGxlJyxcbiAgICAgICAgICAgIHBvdXJGcm9tTGVmdFRvUmlnaHQ6ICgpID0+ICcgcG91ciBmcm9tIHRoZSBsZWZ0IGJvdHRsZSB0byB0aGUgcmlnaHQgYm90dGxlJyxcbiAgICAgICAgICAgIHBvdXJGcm9tUmlnaHRUb0xlZnQ6ICgpID0+ICcgcG91ciBmcm9tIHRoZSByaWdodCBib3R0bGUgdG8gdGhlIGxlZnQgYm90dGxlJyxcbiAgICAgICAgICAgIHBvdXJSaWdodDogKCkgPT4gJyBwb3VyIG91dCB0aGUgcmlnaHQgYm90dGxlJyxcbiAgICAgICAgICAgIGZpbGxSaWdodDogKCkgPT4gJyBmaWxsIHVwIHRoZSByaWdodCBib3R0bGUnXG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IHdoYXRzUG9zc2libGUgaW4gcHJlQ29uZGl0aW9ucykge1xuICAgICAgICAgICAgaWYgKHByZUNvbmRpdGlvbnNbd2hhdHNQb3NzaWJsZV0oKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gcGFyZW50cy5jcmVhdGVDaGlsZChzdG9yeVt3aGF0c1Bvc3NpYmxlXSlcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYm90aEJvdHRsZXNGdWxsT3JFbXB0eShjaGlsZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBib3RoQm90dGxlc0Z1bGxPckVtcHR5KGNoaWxkKSB7XG4gICAgICAgIHJldHVybiAoKGNoaWxkLmxlZnQuaXNGdWxsKCkgJiYgY2hpbGQucmlnaHQuaXNGdWxsKCkpIHx8XG4gICAgICAgICAgICAoY2hpbGQubGVmdC5pc0VtcHR5KCkgJiYgY2hpbGQucmlnaHQuaXNFbXB0eSgpKSlcbiAgICB9XG4gICAgY3JlYXRlQ2hpbGQoaG93SW1NYWRlKSB7XG4gICAgICAgIGNvbnN0IGxlZnQgPSB0aGlzLmxlZnQuY29weSgpLCByaWdodCA9IHRoaXMucmlnaHQuY29weSgpXG5cbiAgICAgICAgc3dpdGNoIChob3dJbU1hZGUubmFtZSkge1xuICAgICAgICAgICAgY2FzZSAnZmlsbExlZnQnOlxuICAgICAgICAgICAgICAgIGxlZnQuZmlsbFVwKClcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAncG91ckxlZnQnOlxuICAgICAgICAgICAgICAgIGxlZnQucG91ck91dCgpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3BvdXJGcm9tTGVmdFRvUmlnaHQnOlxuICAgICAgICAgICAgICAgIGxlZnQucG91ck92ZXJUbyhyaWdodClcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAncG91ckZyb21SaWdodFRvTGVmdCc6XG4gICAgICAgICAgICAgICAgcmlnaHQucG91ck92ZXJUbyhsZWZ0KVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdwb3VyUmlnaHQnOlxuICAgICAgICAgICAgICAgIHJpZ2h0LnBvdXJPdXQoKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdmaWxsUmlnaHQnOlxuICAgICAgICAgICAgICAgIHJpZ2h0LmZpbGxVcCgpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjaGlsZCA9IG5ldyBOb2RlKGxlZnQsIHJpZ2h0KVxuICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzXG4gICAgICAgIGNoaWxkLnByZXZpb3VzQWN0aW9uID0gJyB8ICAnICsgbGVmdC5jb250ZW50ICsgJyAgfCAgJyArIHJpZ2h0LmNvbnRlbnQgKyAnICB8ICcgKyBob3dJbU1hZGUoKVxuICAgICAgICByZXR1cm4gY2hpbGRcbiAgICB9XG5cbiAgICBkZXNjcmliZUFjdGlvbnMoKSB7XG4gICAgICAgIGNvbnN0IGFjdGlvbnMgPSBbXVxuICAgICAgICBsZXQgbm9kZSA9IHRoaXNcbiAgICAgICAgd2hpbGUgKG5vZGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgYWN0aW9ucy51bnNoaWZ0KG5vZGUucHJldmlvdXNBY3Rpb24pXG4gICAgICAgICAgICBub2RlID0gbm9kZS5wYXJlbnRcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNlbnRlbmNlID0gYWN0aW9ucy5qb2luKCcsXFxuJylcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoKHNlbnRlbmNlKVxuICAgIH1cblxuICAgIGZpbmlzaChzZW50ZW5jZSkge1xuICAgICAgICBjb25zdCBtZWFzdXJlID0gdGhpcy5nZXRUYXJnZXRlZEJvdHRsZSgpLmNvbnRlbnRcbiAgICAgICAgY29uc3Qgc2lkZSA9IHRoaXMubGVmdC5oYXNCZWVuVGFyZ2V0ZWQoKSA/ICdsZWZ0JyA6ICdyaWdodCdcbiAgICAgICAgY29uc3QgbGFzdFBhcnQgPSAnIGFuZFxcbiAgICAgRE9ORSEgICAgICB5b3UgaGF2ZSAnXG4gICAgICAgICAgICArIG1lYXN1cmUgKyAnIGxpdGVycyBpbiB0aGUgJ1xuICAgICAgICAgICAgKyBzaWRlICsgJyBib3R0bGUuJ1xuICAgICAgICByZXR1cm4gc2VudGVuY2UgKyBsYXN0UGFydFxuICAgIH1cblxuICAgIGdldFRhcmdldGVkQm90dGxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sZWZ0Lmhhc0JlZW5UYXJnZXRlZCgpID8gdGhpcy5sZWZ0IDogdGhpcy5yaWdodFxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRyZWUge1xuICAgIGNvbnN0cnVjdG9yKGxlZnRCb3R0bGUsIHJpZ2h0Qm90dGxlKSB7XG4gICAgICAgIHRoaXMubm9kZSA9IG5ldyBOb2RlKGxlZnRCb3R0bGUsIHJpZ2h0Qm90dGxlKVxuICAgICAgICB0aGlzLnJvb3QgPSB0aGlzLm5vZGVcbiAgICB9XG5cbiAgICB0cmF2ZXJzZUJyZWFkdGhGaXJzdChpdElzRGVzaXJlZCkge1xuICAgICAgICAvLyBjcmVhdGUgcXVldWUgd2l0aCByb290IG5vZGVcbiAgICAgICAgY29uc3QgcXVldWUgPSBbdGhpcy5yb290XVxuICAgICAgICAvLyBkZXF1ZXVlIHJvb3Qgbm9kZVxuICAgICAgICBsZXQgY3VycmVudE5vZGUgPSBxdWV1ZS5zaGlmdCgpXG5cbiAgICAgICAgd2hpbGUgKGN1cnJlbnROb2RlKSB7XG4gICAgICAgICAgICBpZiAoaXRJc0Rlc2lyZWQoY3VycmVudE5vZGUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnROb2RlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiBub3QgdGhlIGRlc2lyZWQgbm9kZSwgcXVlcXVlIGNoaWxkcmVuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGN1cnJlbnROb2RlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgcXVldWUucHVzaChjaGlsZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGRlcXVldWUgbmV4dCBub2RlIHRvIGxvb2sgYXRcbiAgICAgICAgICAgIGN1cnJlbnROb2RlID0gcXVldWUuc2hpZnQoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ3JvdygpIHtcbiAgICAgICAgdGhpcy5ub2RlLmZpbGxQb3VyT3JUcmFuc2ZlcigpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgZ2V0Tm9kZSh0aGF0SGFzVGhlRGVzaXJlZE1lYXN1cmUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhdmVyc2VCcmVhZHRoRmlyc3QodGhhdEhhc1RoZURlc2lyZWRNZWFzdXJlKVxuICAgIH1cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZmluZChkZXNpcmVkTWVhc3VyZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICBpZiAobm9kZS5sZWZ0LmNvbnRlbnQgPT0gZGVzaXJlZE1lYXN1cmUpIHtcbiAgICAgICAgICAgIG5vZGUubGVmdC5pc1RhcmdldGVkID0gdHJ1ZVxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfSBlbHNlIGlmIChub2RlLnJpZ2h0LmNvbnRlbnQgPT0gZGVzaXJlZE1lYXN1cmUpIHtcbiAgICAgICAgICAgIG5vZGUucmlnaHQuaXNUYXJnZXRlZCA9IHRydWVcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlLmZpbGxQb3VyT3JUcmFuc2ZlcigpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2UgLy8gYW5kIGtlZXAgbG9va2luZ1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jb25zdCBwcmludEhvd1RvR2V0VGhlcmUgPSAobGVmdFZvbHVtZSwgcmlnaHRWb2x1bWUsIGRlc2lyZWRNZWFzdXJlKSA9PiB7XG4gICAgY29uc29sZS5sb2coXG4gICAgICAgIG5ldyBUcmVlKG5ldyBCb3R0bGUobGVmdFZvbHVtZSksIG5ldyBCb3R0bGUocmlnaHRWb2x1bWUpKVxuICAgICAgICAgICAgLmdldE5vZGUoZmluZChkZXNpcmVkTWVhc3VyZSkpXG4gICAgICAgICAgICAuZGVzY3JpYmVBY3Rpb25zKClcbiAgICApXG59XG5cbmV4cG9ydCBjb25zdCBtYWluID0gZnVuY3Rpb24gKCkge1xuICAgIFBSSU5ULndlbGNvbWUoKVxuICAgIFBSSU5ULm1lYXN1cmUxKClcbiAgICBwcmludEhvd1RvR2V0VGhlcmUoMywgNSwgMSlcbiAgICBQUklOVC5ib3JkZXIoKVxuICAgIFBSSU5ULm1lYXN1cmU0KClcbiAgICBwcmludEhvd1RvR2V0VGhlcmUoMywgNSwgNClcbiAgICBQUklOVC5ib3JkZXIoKVxuICAgIFBSSU5ULm1lYXN1cmU4ZnJvbUJvdHRsZXMxYW5kMjAoKVxuICAgIHByaW50SG93VG9HZXRUaGVyZSgxLCAyMCwgOClcbiAgICBQUklOVC5ieWUoKVxufVxuXG5leHBvcnQgY29uc3Qgc2FuaXR5Q2hlY2sgPSAoKSA9PiAnVGVzdCBpcyB3b3JraW5nISdcbm1haW4oKSJdfQ==