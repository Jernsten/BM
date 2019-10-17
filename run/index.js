"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.find = find;exports.Tree = exports.Node = exports.Bottle = exports.sanityCheck = void 0;
var _art = require("./art");function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}
var sanityCheck = function sanityCheck() {return 'Test is working!';};exports.sanityCheck = sanityCheck;var

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
      var thisBottle = this;
      // if nothing to pour over or other bottle has no room
      if (thisBottle.isEmpty() || otherBottle.isFull()) return;
      // else
      var canPour = thisBottle.content;
      var canFit = otherBottle.volume - otherBottle.content;
      var amountToPour = canFit <= canPour ? canFit : canPour;
      otherBottle.content += amountToPour;
      thisBottle.content -= amountToPour;
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
          if (this.isNotBothBottlesFullOrEmpty(child)) {
            this.children.push(child);
          }
        }
      }
    } }, { key: "isNotBothBottlesFullOrEmpty", value: function isNotBothBottlesFullOrEmpty(
    child) {
      return !(child.left.isFull() && child.right.isFull() ||
      child.left.isEmpty() && child.right.isEmpty());
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
      // create queue
      var queue = [];
      // begin with root node
      var currentNode = this.root;

      while (currentNode) {
        if (itIsDesired(currentNode))
        return currentNode;

        // if not the desired node, queque children
        queue.push.apply(queue, _toConsumableArray(currentNode.children));
        // dequeue next node to look at
        currentNode = queue.shift();
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
      node.fillPourOrTransfer(); // generate children
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

function main() {
  _art.PRINT.welcome();
  _art.PRINT.measure1();
  printHowToGetThere(3, 5, 1);
  _art.PRINT.measure4();
  printHowToGetThere(3, 5, 4);
  _art.PRINT.measure8fromBottles1and20();
  printHowToGetThere(1, 20, 8);
  _art.PRINT.bye();
}

main();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJzYW5pdHlDaGVjayIsIkJvdHRsZSIsInZvbHVtZSIsImNvbnRlbnQiLCJpc1RhcmdldGVkIiwib3RoZXJCb3R0bGUiLCJ0aGlzQm90dGxlIiwiaXNFbXB0eSIsImlzRnVsbCIsImNhblBvdXIiLCJjYW5GaXQiLCJhbW91bnRUb1BvdXIiLCJzb21lIiwiYWRkIiwiTm9kZSIsImxlZnRCb3R0bGUiLCJyaWdodEJvdHRsZSIsImxlZnQiLCJyaWdodCIsInBhcmVudCIsImNoaWxkcmVuIiwicHJldmlvdXNBY3Rpb24iLCJwYXJlbnRzIiwicHJlQ29uZGl0aW9ucyIsImZpbGxMZWZ0IiwiaGFzUm9vbSIsInBvdXJMZWZ0IiwiaXNOb3RFbXB0eSIsInBvdXJGcm9tTGVmdFRvUmlnaHQiLCJwb3VyRnJvbVJpZ2h0VG9MZWZ0IiwicG91clJpZ2h0IiwiZmlsbFJpZ2h0Iiwic3RvcnkiLCJ3aGF0c1Bvc3NpYmxlIiwiY2hpbGQiLCJjcmVhdGVDaGlsZCIsImlzTm90Qm90aEJvdHRsZXNGdWxsT3JFbXB0eSIsInB1c2giLCJob3dJbU1hZGUiLCJjb3B5IiwibmFtZSIsImZpbGxVcCIsInBvdXJPdXQiLCJwb3VyT3ZlclRvIiwiYWN0aW9ucyIsIm5vZGUiLCJ1bnNoaWZ0Iiwic2VudGVuY2UiLCJqb2luIiwiZmluaXNoIiwibWVhc3VyZSIsImdldFRhcmdldGVkQm90dGxlIiwic2lkZSIsImhhc0JlZW5UYXJnZXRlZCIsImxhc3RQYXJ0IiwiVHJlZSIsInJvb3QiLCJpdElzRGVzaXJlZCIsInF1ZXVlIiwiY3VycmVudE5vZGUiLCJzaGlmdCIsImZpbGxQb3VyT3JUcmFuc2ZlciIsInRoYXRIYXNUaGVEZXNpcmVkTWVhc3VyZSIsInRyYXZlcnNlQnJlYWR0aEZpcnN0IiwiZmluZCIsImRlc2lyZWRNZWFzdXJlIiwicHJpbnRIb3dUb0dldFRoZXJlIiwibGVmdFZvbHVtZSIsInJpZ2h0Vm9sdW1lIiwiY29uc29sZSIsImxvZyIsImdldE5vZGUiLCJkZXNjcmliZUFjdGlvbnMiLCJtYWluIiwiUFJJTlQiLCJ3ZWxjb21lIiwibWVhc3VyZTEiLCJtZWFzdXJlNCIsIm1lYXN1cmU4ZnJvbUJvdHRsZXMxYW5kMjAiLCJieWUiXSwibWFwcGluZ3MiOiJBQUFBLGE7QUFDQSw0QjtBQUNPLElBQU1BLFdBQVcsR0FBRyxTQUFkQSxXQUFjLFdBQU0sa0JBQU4sRUFBcEIsQzs7QUFFTUMsTTtBQUNULGtCQUFZQyxNQUFaLEVBQW9CO0FBQ2hCLFNBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUNBLFNBQUtDLE9BQUwsR0FBZSxDQUFmO0FBQ0E7QUFDQSxTQUFLQyxVQUFMLEdBQWtCLEtBQWxCO0FBQ0gsRzs7QUFFUTtBQUNMLFdBQUtELE9BQUwsR0FBZSxLQUFLRCxNQUFwQjtBQUNBLGFBQU8sSUFBUDtBQUNILEs7O0FBRVM7QUFDTixXQUFLQyxPQUFMLEdBQWUsQ0FBZjtBQUNBLGFBQU8sSUFBUDtBQUNILEs7O0FBRVVFLElBQUFBLFcsRUFBYTtBQUNwQixVQUFNQyxVQUFVLEdBQUcsSUFBbkI7QUFDQTtBQUNBLFVBQUlBLFVBQVUsQ0FBQ0MsT0FBWCxNQUF3QkYsV0FBVyxDQUFDRyxNQUFaLEVBQTVCLEVBQWtEO0FBQ2xEO0FBQ0EsVUFBTUMsT0FBTyxHQUFHSCxVQUFVLENBQUNILE9BQTNCO0FBQ0EsVUFBTU8sTUFBTSxHQUFHTCxXQUFXLENBQUNILE1BQVosR0FBcUJHLFdBQVcsQ0FBQ0YsT0FBaEQ7QUFDQSxVQUFNUSxZQUFZLEdBQUdELE1BQU0sSUFBSUQsT0FBVixHQUFvQkMsTUFBcEIsR0FBNkJELE9BQWxEO0FBQ0FKLE1BQUFBLFdBQVcsQ0FBQ0YsT0FBWixJQUF1QlEsWUFBdkI7QUFDQUwsTUFBQUEsVUFBVSxDQUFDSCxPQUFYLElBQXNCUSxZQUF0QjtBQUNILEs7O0FBRVM7QUFDTixhQUFRLEtBQUtULE1BQUwsR0FBYyxLQUFLQyxPQUFwQixHQUErQixDQUF0QztBQUNILEs7O0FBRVk7QUFDVCxhQUFPLEtBQUtBLE9BQUwsR0FB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QUl0RCxNQUFKLENBQVdrRSxVQUFYLENBQVQsRUFBaUMsSUFBSWxFLE1BQUosQ0FBV21FLFdBQVgsQ0FBakM7QUFDS0csRUFBQUEsT0FETCxDQUNhUCxJQUFJLENBQUNDLGNBQUQsQ0FEakI7QUFFS08sRUFBQUEsZUFGTCxFQURKOztBQUtILENBTkQ7O0FBUUEsU0FBU0MsSUFBVCxHQUFnQjtBQUNaQyxhQUFNQyxPQUFOO0FBQ0FELGFBQU1FLFFBQU47QUFDQVYsRUFBQUEsa0JBQWtCLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBQWxCO0FBQ0FRLGFBQU1HLFFBQU47QUFDQVgsRUFBQUEsa0JBQWtCLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBQWxCO0FBQ0FRLGFBQU1JLHlCQUFOO0FBQ0FaLEVBQUFBLGtCQUFrQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsQ0FBUixDQUFsQjtBQUNBUSxhQUFNSyxHQUFOO0FBQ0g7O0FBRUROLElBQUkiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxyXG5pbXBvcnQgeyBQUklOVCB9IGZyb20gJy4vYXJ0J1xyXG5leHBvcnQgY29uc3Qgc2FuaXR5Q2hlY2sgPSAoKSA9PiAnVGVzdCBpcyB3b3JraW5nISdcclxuXHJcbmV4cG9ydCBjbGFzcyBCb3R0bGUge1xyXG4gICAgY29uc3RydWN0b3Iodm9sdW1lKSB7XHJcbiAgICAgICAgdGhpcy52b2x1bWUgPSB2b2x1bWVcclxuICAgICAgICB0aGlzLmNvbnRlbnQgPSAwXHJcbiAgICAgICAgLy8gaWYgdGhpcyBib3R0bGUgaGFzIHRoZSBkZXNpcmVkIG1lYXN1cmVcclxuICAgICAgICB0aGlzLmlzVGFyZ2V0ZWQgPSBmYWxzZVxyXG4gICAgfVxyXG5cclxuICAgIGZpbGxVcCgpIHtcclxuICAgICAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLnZvbHVtZVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgcG91ck91dCgpIHtcclxuICAgICAgICB0aGlzLmNvbnRlbnQgPSAwXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICBwb3VyT3ZlclRvKG90aGVyQm90dGxlKSB7XHJcbiAgICAgICAgY29uc3QgdGhpc0JvdHRsZSA9IHRoaXNcclxuICAgICAgICAvLyBpZiBub3RoaW5nIHRvIHBvdXIgb3ZlciBvciBvdGhlciBib3R0bGUgaGFzIG5vIHJvb21cclxuICAgICAgICBpZiAodGhpc0JvdHRsZS5pc0VtcHR5KCkgfHwgb3RoZXJCb3R0bGUuaXNGdWxsKCkpIHJldHVyblxyXG4gICAgICAgIC8vIGVsc2VcclxuICAgICAgICBjb25zdCBjYW5Qb3VyID0gdGhpc0JvdHRsZS5jb250ZW50XHJcbiAgICAgICAgY29uc3QgY2FuRml0ID0gb3RoZXJCb3R0bGUudm9sdW1lIC0gb3RoZXJCb3R0bGUuY29udGVudFxyXG4gICAgICAgIGNvbnN0IGFtb3VudFRvUG91ciA9IGNhbkZpdCA8PSBjYW5Qb3VyID8gY2FuRml0IDogY2FuUG91clxyXG4gICAgICAgIG90aGVyQm90dGxlLmNvbnRlbnQgKz0gYW1vdW50VG9Qb3VyXHJcbiAgICAgICAgdGhpc0JvdHRsZS5jb250ZW50IC09IGFtb3VudFRvUG91clxyXG4gICAgfVxyXG5cclxuICAgIGhhc1Jvb20oKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLnZvbHVtZSAtIHRoaXMuY29udGVudCkgPiAwXHJcbiAgICB9XHJcblxyXG4gICAgaXNOb3RFbXB0eSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50ID4gMFxyXG4gICAgfVxyXG5cclxuICAgIGlzRW1wdHkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudCA9PSAwXHJcbiAgICB9XHJcblxyXG4gICAgaXNGdWxsKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQgPT0gdGhpcy52b2x1bWVcclxuICAgIH1cclxuXHJcbiAgICBhZGQoc29tZSkge1xyXG4gICAgICAgIHRoaXMuY29udGVudCArPSBzb21lXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICB0YWtlKHNvbWUpIHtcclxuICAgICAgICB0aGlzLmNvbnRlbnQgLT0gc29tZVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgY29weSgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IEJvdHRsZSh0aGlzLnZvbHVtZSkuYWRkKHRoaXMuY29udGVudClcclxuICAgIH1cclxuXHJcbiAgICBoYXNCZWVuVGFyZ2V0ZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNUYXJnZXRlZFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTm9kZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihsZWZ0Qm90dGxlLCByaWdodEJvdHRsZSkge1xyXG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnRCb3R0bGVcclxuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHRCb3R0bGVcclxuICAgICAgICB0aGlzLnBhcmVudCA9IG51bGxcclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW11cclxuXHJcbiAgICAgICAgLy8gVGhlIGxpdGVyYWwgYmVnaW5uaW5ncywgd2lsbCBiZSBvdmVycml0ZW4gZXhjZXB0IGZvciByb290IG5vZGVcclxuICAgICAgICB0aGlzLnByZXZpb3VzQWN0aW9uID0gJ1xcbiBfX18nICsgbGVmdEJvdHRsZS52b2x1bWUgKyAnX19fX18nXHJcbiAgICAgICAgICAgICsgcmlnaHRCb3R0bGUudm9sdW1lICsgJ19fXyAgVGFrZSB0d28gZW1wdHkgYm90dGxlcyBvZiAnXHJcbiAgICAgICAgICAgICsgbGVmdEJvdHRsZS52b2x1bWUgKyAnIGFuZCAnICsgcmlnaHRCb3R0bGUudm9sdW1lICsgJyBsaXRlcnMnXHJcbiAgICB9XHJcblxyXG4gICAgZmlsbFBvdXJPclRyYW5zZmVyKCkge1xyXG4gICAgICAgIGNvbnN0IHBhcmVudHMgPSB0aGlzXHJcblxyXG4gICAgICAgIGNvbnN0IHByZUNvbmRpdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIGZpbGxMZWZ0OiAoKSA9PiBwYXJlbnRzLmxlZnQuaGFzUm9vbSgpLFxyXG4gICAgICAgICAgICBwb3VyTGVmdDogKCkgPT4gcGFyZW50cy5sZWZ0LmlzTm90RW1wdHkoKSxcclxuICAgICAgICAgICAgcG91ckZyb21MZWZ0VG9SaWdodDogKCkgPT4gcGFyZW50cy5sZWZ0LmlzTm90RW1wdHkoKSAmJiBwYXJlbnRzLnJpZ2h0Lmhhc1Jvb20oKSxcclxuICAgICAgICAgICAgcG91ckZyb21SaWdodFRvTGVmdDogKCkgPT4gcGFyZW50cy5yaWdodC5pc05vdEVtcHR5KCkgJiYgcGFyZW50cy5sZWZ0Lmhhc1Jvb20oKSxcclxuICAgICAgICAgICAgcG91clJpZ2h0OiAoKSA9PiBwYXJlbnRzLnJpZ2h0LmlzTm90RW1wdHkoKSxcclxuICAgICAgICAgICAgZmlsbFJpZ2h0OiAoKSA9PiBwYXJlbnRzLnJpZ2h0Lmhhc1Jvb20oKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgc3RvcnkgPSB7XHJcbiAgICAgICAgICAgIGZpbGxMZWZ0OiAoKSA9PiAnIGZpbGwgdXAgdGhlIGxlZnQgYm90dGxlJyxcclxuICAgICAgICAgICAgcG91ckxlZnQ6ICgpID0+ICcgcG91ciBvdXQgdGhlIGxlZnQgYm90dGxlJyxcclxuICAgICAgICAgICAgcG91ckZyb21MZWZ0VG9SaWdodDogKCkgPT4gJyBwb3VyIGZyb20gdGhlIGxlZnQgYm90dGxlIHRvIHRoZSByaWdodCBib3R0bGUnLFxyXG4gICAgICAgICAgICBwb3VyRnJvbVJpZ2h0VG9MZWZ0OiAoKSA9PiAnIHBvdXIgZnJvbSB0aGUgcmlnaHQgYm90dGxlIHRvIHRoZSBsZWZ0IGJvdHRsZScsXHJcbiAgICAgICAgICAgIHBvdXJSaWdodDogKCkgPT4gJyBwb3VyIG91dCB0aGUgcmlnaHQgYm90dGxlJyxcclxuICAgICAgICAgICAgZmlsbFJpZ2h0OiAoKSA9PiAnIGZpbGwgdXAgdGhlIHJpZ2h0IGJvdHRsZSdcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoY29uc3Qgd2hhdHNQb3NzaWJsZSBpbiBwcmVDb25kaXRpb25zKSB7XHJcbiAgICAgICAgICAgIGlmIChwcmVDb25kaXRpb25zW3doYXRzUG9zc2libGVdKCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gcGFyZW50cy5jcmVhdGVDaGlsZChzdG9yeVt3aGF0c1Bvc3NpYmxlXSlcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzTm90Qm90aEJvdHRsZXNGdWxsT3JFbXB0eShjaGlsZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goY2hpbGQpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpc05vdEJvdGhCb3R0bGVzRnVsbE9yRW1wdHkoY2hpbGQpIHtcclxuICAgICAgICByZXR1cm4gISgoY2hpbGQubGVmdC5pc0Z1bGwoKSAmJiBjaGlsZC5yaWdodC5pc0Z1bGwoKSkgfHxcclxuICAgICAgICAgICAgKGNoaWxkLmxlZnQuaXNFbXB0eSgpICYmIGNoaWxkLnJpZ2h0LmlzRW1wdHkoKSkpXHJcbiAgICB9XHJcbiAgICBjcmVhdGVDaGlsZChob3dJbU1hZGUpIHtcclxuICAgICAgICBjb25zdCBsZWZ0ID0gdGhpcy5sZWZ0LmNvcHkoKSwgcmlnaHQgPSB0aGlzLnJpZ2h0LmNvcHkoKVxyXG5cclxuICAgICAgICBzd2l0Y2ggKGhvd0ltTWFkZS5uYW1lKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2ZpbGxMZWZ0JzpcclxuICAgICAgICAgICAgICAgIGxlZnQuZmlsbFVwKClcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3BvdXJMZWZ0JzpcclxuICAgICAgICAgICAgICAgIGxlZnQucG91ck91dCgpXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICdwb3VyRnJvbUxlZnRUb1JpZ2h0JzpcclxuICAgICAgICAgICAgICAgIGxlZnQucG91ck92ZXJUbyhyaWdodClcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3BvdXJGcm9tUmlnaHRUb0xlZnQnOlxyXG4gICAgICAgICAgICAgICAgcmlnaHQucG91ck92ZXJUbyhsZWZ0KVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAncG91clJpZ2h0JzpcclxuICAgICAgICAgICAgICAgIHJpZ2h0LnBvdXJPdXQoKVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAnZmlsbFJpZ2h0JzpcclxuICAgICAgICAgICAgICAgIHJpZ2h0LmZpbGxVcCgpXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBjaGlsZCA9IG5ldyBOb2RlKGxlZnQsIHJpZ2h0KVxyXG4gICAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXNcclxuICAgICAgICBjaGlsZC5wcmV2aW91c0FjdGlvbiA9ICcgfCAgJyArIGxlZnQuY29udGVudCArICcgIHwgICcgKyByaWdodC5jb250ZW50ICsgJyAgfCAnICsgaG93SW1NYWRlKClcclxuICAgICAgICByZXR1cm4gY2hpbGRcclxuICAgIH1cclxuXHJcbiAgICBkZXNjcmliZUFjdGlvbnMoKSB7XHJcbiAgICAgICAgY29uc3QgYWN0aW9ucyA9IFtdXHJcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzXHJcbiAgICAgICAgd2hpbGUgKG5vZGUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBhY3Rpb25zLnVuc2hpZnQobm9kZS5wcmV2aW91c0FjdGlvbilcclxuICAgICAgICAgICAgbm9kZSA9IG5vZGUucGFyZW50XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBzZW50ZW5jZSA9IGFjdGlvbnMuam9pbignLFxcbicpXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoKHNlbnRlbmNlKVxyXG4gICAgfVxyXG5cclxuICAgIGZpbmlzaChzZW50ZW5jZSkge1xyXG4gICAgICAgIGNvbnN0IG1lYXN1cmUgPSB0aGlzLmdldFRhcmdldGVkQm90dGxlKCkuY29udGVudFxyXG4gICAgICAgIGNvbnN0IHNpZGUgPSB0aGlzLmxlZnQuaGFzQmVlblRhcmdldGVkKCkgPyAnbGVmdCcgOiAncmlnaHQnXHJcbiAgICAgICAgY29uc3QgbGFzdFBhcnQgPSAnIGFuZFxcbiAgICAgRE9ORSEgICAgICB5b3UgaGF2ZSAnXHJcbiAgICAgICAgICAgICsgbWVhc3VyZSArICcgbGl0ZXJzIGluIHRoZSAnXHJcbiAgICAgICAgICAgICsgc2lkZSArICcgYm90dGxlLidcclxuICAgICAgICByZXR1cm4gc2VudGVuY2UgKyBsYXN0UGFydFxyXG4gICAgfVxyXG5cclxuICAgIGdldFRhcmdldGVkQm90dGxlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxlZnQuaGFzQmVlblRhcmdldGVkKCkgPyB0aGlzLmxlZnQgOiB0aGlzLnJpZ2h0XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUcmVlIHtcclxuICAgIGNvbnN0cnVjdG9yKGxlZnRCb3R0bGUsIHJpZ2h0Qm90dGxlKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlID0gbmV3IE5vZGUobGVmdEJvdHRsZSwgcmlnaHRCb3R0bGUpXHJcbiAgICAgICAgdGhpcy5yb290ID0gdGhpcy5ub2RlXHJcbiAgICB9XHJcblxyXG4gICAgdHJhdmVyc2VCcmVhZHRoRmlyc3QoaXRJc0Rlc2lyZWQpIHtcclxuICAgICAgICAvLyBjcmVhdGUgcXVldWVcclxuICAgICAgICBjb25zdCBxdWV1ZSA9IFtdXHJcbiAgICAgICAgLy8gYmVnaW4gd2l0aCByb290IG5vZGVcclxuICAgICAgICBsZXQgY3VycmVudE5vZGUgPSB0aGlzLnJvb3RcclxuXHJcbiAgICAgICAgd2hpbGUgKGN1cnJlbnROb2RlKSB7XHJcbiAgICAgICAgICAgIGlmIChpdElzRGVzaXJlZChjdXJyZW50Tm9kZSkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudE5vZGVcclxuXHJcbiAgICAgICAgICAgIC8vIGlmIG5vdCB0aGUgZGVzaXJlZCBub2RlLCBxdWVxdWUgY2hpbGRyZW5cclxuICAgICAgICAgICAgcXVldWUucHVzaCguLi5jdXJyZW50Tm9kZS5jaGlsZHJlbilcclxuICAgICAgICAgICAgLy8gZGVxdWV1ZSBuZXh0IG5vZGUgdG8gbG9vayBhdFxyXG4gICAgICAgICAgICBjdXJyZW50Tm9kZSA9IHF1ZXVlLnNoaWZ0KClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ3JvdygpIHtcclxuICAgICAgICB0aGlzLm5vZGUuZmlsbFBvdXJPclRyYW5zZmVyKClcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIGdldE5vZGUodGhhdEhhc1RoZURlc2lyZWRNZWFzdXJlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhdmVyc2VCcmVhZHRoRmlyc3QodGhhdEhhc1RoZURlc2lyZWRNZWFzdXJlKVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbmQoZGVzaXJlZE1lYXN1cmUpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgICAgIGlmIChub2RlLmxlZnQuY29udGVudCA9PSBkZXNpcmVkTWVhc3VyZSkge1xyXG4gICAgICAgICAgICBub2RlLmxlZnQuaXNUYXJnZXRlZCA9IHRydWVcclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICB9IGVsc2UgaWYgKG5vZGUucmlnaHQuY29udGVudCA9PSBkZXNpcmVkTWVhc3VyZSkge1xyXG4gICAgICAgICAgICBub2RlLnJpZ2h0LmlzVGFyZ2V0ZWQgPSB0cnVlXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbm9kZS5maWxsUG91ck9yVHJhbnNmZXIoKSAvLyBnZW5lcmF0ZSBjaGlsZHJlblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2UgLy8gYW5kIGtlZXAgbG9va2luZ1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgcHJpbnRIb3dUb0dldFRoZXJlID0gKGxlZnRWb2x1bWUsIHJpZ2h0Vm9sdW1lLCBkZXNpcmVkTWVhc3VyZSkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coXHJcbiAgICAgICAgbmV3IFRyZWUobmV3IEJvdHRsZShsZWZ0Vm9sdW1lKSwgbmV3IEJvdHRsZShyaWdodFZvbHVtZSkpXHJcbiAgICAgICAgICAgIC5nZXROb2RlKGZpbmQoZGVzaXJlZE1lYXN1cmUpKVxyXG4gICAgICAgICAgICAuZGVzY3JpYmVBY3Rpb25zKClcclxuICAgIClcclxufVxyXG5cclxuZnVuY3Rpb24gbWFpbigpIHtcclxuICAgIFBSSU5ULndlbGNvbWUoKVxyXG4gICAgUFJJTlQubWVhc3VyZTEoKVxyXG4gICAgcHJpbnRIb3dUb0dldFRoZXJlKDMsIDUsIDEpXHJcbiAgICBQUklOVC5tZWFzdXJlNCgpXHJcbiAgICBwcmludEhvd1RvR2V0VGhlcmUoMywgNSwgNClcclxuICAgIFBSSU5ULm1lYXN1cmU4ZnJvbUJvdHRsZXMxYW5kMjAoKVxyXG4gICAgcHJpbnRIb3dUb0dldFRoZXJlKDEsIDIwLCA4KVxyXG4gICAgUFJJTlQuYnllKClcclxufVxyXG5cclxubWFpbigpIl19