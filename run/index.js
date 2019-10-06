"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.find = find;exports.Tree = exports.Node = exports.Bottle = exports.sanityCheck = void 0;
var _art = require("./art");function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJzYW5pdHlDaGVjayIsIkJvdHRsZSIsInZvbHVtZSIsImNvbnRlbnQiLCJpc1RhcmdldGVkIiwib3RoZXJCb3R0bGUiLCJjYW5Qb3VyIiwiY2FuRml0IiwiYW1vdW50VG9Qb3VyIiwic29tZSIsImFkZCIsIk5vZGUiLCJsZWZ0Qm90dGxlIiwicmlnaHRCb3R0bGUiLCJsZWZ0IiwicmlnaHQiLCJwYXJlbnQiLCJjaGlsZHJlbiIsInByZXZpb3VzQWN0aW9uIiwicGFyZW50cyIsInByZUNvbmRpdGlvbnMiLCJmaWxsTGVmdCIsImhhc1Jvb20iLCJwb3VyTGVmdCIsImlzTm90RW1wdHkiLCJwb3VyRnJvbUxlZnRUb1JpZ2h0IiwicG91ckZyb21SaWdodFRvTGVmdCIsInBvdXJSaWdodCIsImZpbGxSaWdodCIsInN0b3J5Iiwid2hhdHNQb3NzaWJsZSIsImNoaWxkIiwiY3JlYXRlQ2hpbGQiLCJib3RoQm90dGxlc0Z1bGxPckVtcHR5IiwicHVzaCIsImlzRnVsbCIsImlzRW1wdHkiLCJob3dJbU1hZGUiLCJjb3B5IiwibmFtZSIsImZpbGxVcCIsInBvdXJPdXQiLCJwb3VyT3ZlclRvIiwiYWN0aW9ucyIsIm5vZGUiLCJ1bnNoaWZ0Iiwic2VudGVuY2UiLCJqb2luIiwiZmluaXNoIiwibWVhc3VyZSIsImdldFRhcmdldGVkQm90dGxlIiwic2lkZSIsImhhc0JlZW5UYXJnZXRlZCIsImxhc3RQYXJ0IiwiVHJlZSIsInJvb3QiLCJpdElzRGVzaXJlZCIsInF1ZXVlIiwiY3VycmVudE5vZGUiLCJzaGlmdCIsImZpbGxQb3VyT3JUcmFuc2ZlciIsInRoYXRIYXNUaGVEZXNpcmVkTWVhc3VyZSIsInRyYXZlcnNlQnJlYWR0aEZpcnN0IiwiZmluZCIsImRlc2lyZWRNZWFzdXJlIiwicHJpbnRIb3dUb0dldFRoZXJlIiwibGVmdFZvbHVtZSIsInJpZ2h0Vm9sdW1lIiwiY29uc29sZSIsImxvZyIsImdldE5vZGUiLCJkZXNjcmliZUFjdGlvbnMiLCJtYWluIiwiUFJJTlQiLCJ3ZWxjb21lIiwibWVhc3VyZTEiLCJtZWFzdXJlNCIsIm1lYXN1cmU4ZnJvbUJvdHRsZXMxYW5kMjAiLCJieWUiXSwibWFwcGluZ3MiOiJBQUFBLGE7QUFDQSw0QjtBQUNPLElBQU1BLFdBQVcsR0FBRyxTQUFkQSxXQUFjLFdBQU0sa0JBQU4sRUFBcEIsQzs7QUFFTUMsTTtBQUNULGtCQUFZQyxNQUFaLEVBQW9CO0FBQ2hCLFNBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUNBLFNBQUtDLE9BQUwsR0FBZSxDQUFmO0FBQ0E7QUFDQSxTQUFLQyxVQUFMLEdBQWtCLEtBQWxCO0FBQ0gsRzs7QUFFUTtBQUNMLFdBQUtELE9BQUwsR0FBZSxLQUFLRCxNQUFwQjtBQUNBLGFBQU8sSUFBUDtBQUNILEs7O0FBRVM7QUFDTixXQUFLQyxPQUFMLEdBQWUsQ0FBZjtBQUNBLGFBQU8sSUFBUDtBQUNILEs7O0FBRVVFLElBQUFBLFcsRUFBYTtBQUNwQixVQUFNQyxPQUFPLEdBQUcsS0FBS0gsT0FBckI7QUFDQSxVQUFNSSxNQUFNLEdBQUdGLFdBQVcsQ0FBQ0gsTUFBWixHQUFxQkcsV0FBVyxDQUFDRixPQUFoRDtBQUNBO0FBQ0EsVUFBSUksTUFBTSxJQUFJLENBQVYsSUFBZUQsT0FBTyxJQUFJLENBQTlCLEVBQWlDO0FBQ2pDO0FBQ0EsVUFBTUUsWUFBWSxHQUFHRCxNQUFNLElBQUlELE9BQVYsR0FBb0JDLE1BQXBCLEdBQTZCRCxPQUFsRDtBQUNBRCxNQUFBQSxXQUFXLENBQUNGLE9BQVosSUFBdUJLLFlBQXZCO0FBQ0EsV0FBS0wsT0FBTCxJQUFnQkssWUFBaEI7QUFDSCxLOztBQUVTO0FBQ04sYUFBUSxLQUFLTixNQUFMLEdBQWMsS0FBS0MsT0FBcEIsR0FBK0IsQ0FBdEM7QUFDSCxLOztBQUVZO0FBQ1QsYUFBTyxLQUFLQSxPQUFMLEdBQWUsQ0FBdEI7QUFDSCxLOztBQUVTO0FBQ04sYUFBTyxLQUFLQSxPQUFMLElBQWdCLENBQXZCO0FBQ0gsSzs7QUFFUTtBQUNM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QVdpRSxVQUFYLENBQVQsRUFBaUMsSUFBSWpFLE1BQUosQ0FBV2tFLFdBQVgsQ0FBakM7QUFDS0csRUFBQUEsT0FETCxDQUNhUCxJQUFJLENBQUNDLGNBQUQsQ0FEakI7QUFFS08sRUFBQUEsZUFGTCxFQURKOztBQUtILENBTkQ7O0FBUUEsU0FBU0MsSUFBVCxHQUFnQjtBQUNaQyxhQUFNQyxPQUFOO0FBQ0FELGFBQU1FLFFBQU47QUFDQVYsRUFBQUEsa0JBQWtCLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBQWxCO0FBQ0FRLGFBQU1HLFFBQU47QUFDQVgsRUFBQUEsa0JBQWtCLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBQWxCO0FBQ0FRLGFBQU1JLHlCQUFOO0FBQ0FaLEVBQUFBLGtCQUFrQixDQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsQ0FBUixDQUFsQjtBQUNBUSxhQUFNSyxHQUFOO0FBQ0g7O0FBRUROLElBQUkiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxuaW1wb3J0IHsgUFJJTlQgfSBmcm9tICcuL2FydCdcbmV4cG9ydCBjb25zdCBzYW5pdHlDaGVjayA9ICgpID0+ICdUZXN0IGlzIHdvcmtpbmchJ1xuXG5leHBvcnQgY2xhc3MgQm90dGxlIHtcbiAgICBjb25zdHJ1Y3Rvcih2b2x1bWUpIHtcbiAgICAgICAgdGhpcy52b2x1bWUgPSB2b2x1bWVcbiAgICAgICAgdGhpcy5jb250ZW50ID0gMFxuICAgICAgICAvLyBpZiB0aGlzIGJvdHRsZSBoYXMgdGhlIGRlc2lyZWQgbWVhc3VyZVxuICAgICAgICB0aGlzLmlzVGFyZ2V0ZWQgPSBmYWxzZVxuICAgIH1cblxuICAgIGZpbGxVcCgpIHtcbiAgICAgICAgdGhpcy5jb250ZW50ID0gdGhpcy52b2x1bWVcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBwb3VyT3V0KCkge1xuICAgICAgICB0aGlzLmNvbnRlbnQgPSAwXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgcG91ck92ZXJUbyhvdGhlckJvdHRsZSkge1xuICAgICAgICBjb25zdCBjYW5Qb3VyID0gdGhpcy5jb250ZW50XG4gICAgICAgIGNvbnN0IGNhbkZpdCA9IG90aGVyQm90dGxlLnZvbHVtZSAtIG90aGVyQm90dGxlLmNvbnRlbnRcbiAgICAgICAgLy8gY2FudCBmaXQgYW55bW9yZSBvciBub3RoaW5nIHRvIHBvdXIgb3ZlclxuICAgICAgICBpZiAoY2FuRml0ID09IDAgfHwgY2FuUG91ciA9PSAwKSByZXR1cm5cbiAgICAgICAgLy8gZWxzZVxuICAgICAgICBjb25zdCBhbW91bnRUb1BvdXIgPSBjYW5GaXQgPD0gY2FuUG91ciA/IGNhbkZpdCA6IGNhblBvdXJcbiAgICAgICAgb3RoZXJCb3R0bGUuY29udGVudCArPSBhbW91bnRUb1BvdXJcbiAgICAgICAgdGhpcy5jb250ZW50IC09IGFtb3VudFRvUG91clxuICAgIH1cblxuICAgIGhhc1Jvb20oKSB7XG4gICAgICAgIHJldHVybiAodGhpcy52b2x1bWUgLSB0aGlzLmNvbnRlbnQpID4gMFxuICAgIH1cblxuICAgIGlzTm90RW1wdHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQgPiAwXG4gICAgfVxuXG4gICAgaXNFbXB0eSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudCA9PSAwXG4gICAgfVxuXG4gICAgaXNGdWxsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50ID09IHRoaXMudm9sdW1lXG4gICAgfVxuXG4gICAgYWRkKHNvbWUpIHtcbiAgICAgICAgdGhpcy5jb250ZW50ICs9IHNvbWVcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICB0YWtlKHNvbWUpIHtcbiAgICAgICAgdGhpcy5jb250ZW50IC09IHNvbWVcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBjb3B5KCkge1xuICAgICAgICByZXR1cm4gbmV3IEJvdHRsZSh0aGlzLnZvbHVtZSkuYWRkKHRoaXMuY29udGVudClcbiAgICB9XG5cbiAgICBoYXNCZWVuVGFyZ2V0ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzVGFyZ2V0ZWRcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOb2RlIHtcbiAgICBjb25zdHJ1Y3RvcihsZWZ0Qm90dGxlLCByaWdodEJvdHRsZSkge1xuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0Qm90dGxlXG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodEJvdHRsZVxuICAgICAgICB0aGlzLnBhcmVudCA9IG51bGxcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdXG5cbiAgICAgICAgLy8gVGhlIGxpdGVyYWwgYmVnaW5uaW5ncywgd2lsbCBiZSBvdmVycml0ZW4gZXhjZXB0IGZvciByb290IG5vZGVcbiAgICAgICAgdGhpcy5wcmV2aW91c0FjdGlvbiA9ICdcXG4gX19fJyArIGxlZnRCb3R0bGUudm9sdW1lICsgJ19fX19fJ1xuICAgICAgICAgICAgKyByaWdodEJvdHRsZS52b2x1bWUgKyAnX19fICBUYWtlIHR3byBlbXB0eSBib3R0bGVzIG9mICdcbiAgICAgICAgICAgICsgbGVmdEJvdHRsZS52b2x1bWUgKyAnIGFuZCAnICsgcmlnaHRCb3R0bGUudm9sdW1lICsgJyBsaXRlcnMnXG4gICAgfVxuXG4gICAgZmlsbFBvdXJPclRyYW5zZmVyKCkge1xuICAgICAgICBjb25zdCBwYXJlbnRzID0gdGhpc1xuXG4gICAgICAgIGNvbnN0IHByZUNvbmRpdGlvbnMgPSB7XG4gICAgICAgICAgICBmaWxsTGVmdDogKCkgPT4gcGFyZW50cy5sZWZ0Lmhhc1Jvb20oKSxcbiAgICAgICAgICAgIHBvdXJMZWZ0OiAoKSA9PiBwYXJlbnRzLmxlZnQuaXNOb3RFbXB0eSgpLFxuICAgICAgICAgICAgcG91ckZyb21MZWZ0VG9SaWdodDogKCkgPT4gcGFyZW50cy5sZWZ0LmlzTm90RW1wdHkoKSAmJiBwYXJlbnRzLnJpZ2h0Lmhhc1Jvb20oKSxcbiAgICAgICAgICAgIHBvdXJGcm9tUmlnaHRUb0xlZnQ6ICgpID0+IHBhcmVudHMucmlnaHQuaXNOb3RFbXB0eSgpICYmIHBhcmVudHMubGVmdC5oYXNSb29tKCksXG4gICAgICAgICAgICBwb3VyUmlnaHQ6ICgpID0+IHBhcmVudHMucmlnaHQuaXNOb3RFbXB0eSgpLFxuICAgICAgICAgICAgZmlsbFJpZ2h0OiAoKSA9PiBwYXJlbnRzLnJpZ2h0Lmhhc1Jvb20oKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3RvcnkgPSB7XG4gICAgICAgICAgICBmaWxsTGVmdDogKCkgPT4gJyBmaWxsIHVwIHRoZSBsZWZ0IGJvdHRsZScsXG4gICAgICAgICAgICBwb3VyTGVmdDogKCkgPT4gJyBwb3VyIG91dCB0aGUgbGVmdCBib3R0bGUnLFxuICAgICAgICAgICAgcG91ckZyb21MZWZ0VG9SaWdodDogKCkgPT4gJyBwb3VyIGZyb20gdGhlIGxlZnQgYm90dGxlIHRvIHRoZSByaWdodCBib3R0bGUnLFxuICAgICAgICAgICAgcG91ckZyb21SaWdodFRvTGVmdDogKCkgPT4gJyBwb3VyIGZyb20gdGhlIHJpZ2h0IGJvdHRsZSB0byB0aGUgbGVmdCBib3R0bGUnLFxuICAgICAgICAgICAgcG91clJpZ2h0OiAoKSA9PiAnIHBvdXIgb3V0IHRoZSByaWdodCBib3R0bGUnLFxuICAgICAgICAgICAgZmlsbFJpZ2h0OiAoKSA9PiAnIGZpbGwgdXAgdGhlIHJpZ2h0IGJvdHRsZSdcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3Qgd2hhdHNQb3NzaWJsZSBpbiBwcmVDb25kaXRpb25zKSB7XG4gICAgICAgICAgICBpZiAocHJlQ29uZGl0aW9uc1t3aGF0c1Bvc3NpYmxlXSgpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGQgPSBwYXJlbnRzLmNyZWF0ZUNoaWxkKHN0b3J5W3doYXRzUG9zc2libGVdKVxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5ib3RoQm90dGxlc0Z1bGxPckVtcHR5KGNoaWxkKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goY2hpbGQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGJvdGhCb3R0bGVzRnVsbE9yRW1wdHkoY2hpbGQpIHtcbiAgICAgICAgcmV0dXJuICgoY2hpbGQubGVmdC5pc0Z1bGwoKSAmJiBjaGlsZC5yaWdodC5pc0Z1bGwoKSkgfHxcbiAgICAgICAgICAgIChjaGlsZC5sZWZ0LmlzRW1wdHkoKSAmJiBjaGlsZC5yaWdodC5pc0VtcHR5KCkpKVxuICAgIH1cbiAgICBjcmVhdGVDaGlsZChob3dJbU1hZGUpIHtcbiAgICAgICAgY29uc3QgbGVmdCA9IHRoaXMubGVmdC5jb3B5KCksIHJpZ2h0ID0gdGhpcy5yaWdodC5jb3B5KClcblxuICAgICAgICBzd2l0Y2ggKGhvd0ltTWFkZS5uYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdmaWxsTGVmdCc6XG4gICAgICAgICAgICAgICAgbGVmdC5maWxsVXAoKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdwb3VyTGVmdCc6XG4gICAgICAgICAgICAgICAgbGVmdC5wb3VyT3V0KClcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAncG91ckZyb21MZWZ0VG9SaWdodCc6XG4gICAgICAgICAgICAgICAgbGVmdC5wb3VyT3ZlclRvKHJpZ2h0KVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdwb3VyRnJvbVJpZ2h0VG9MZWZ0JzpcbiAgICAgICAgICAgICAgICByaWdodC5wb3VyT3ZlclRvKGxlZnQpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3BvdXJSaWdodCc6XG4gICAgICAgICAgICAgICAgcmlnaHQucG91ck91dCgpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ2ZpbGxSaWdodCc6XG4gICAgICAgICAgICAgICAgcmlnaHQuZmlsbFVwKClcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNoaWxkID0gbmV3IE5vZGUobGVmdCwgcmlnaHQpXG4gICAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXNcbiAgICAgICAgY2hpbGQucHJldmlvdXNBY3Rpb24gPSAnIHwgICcgKyBsZWZ0LmNvbnRlbnQgKyAnICB8ICAnICsgcmlnaHQuY29udGVudCArICcgIHwgJyArIGhvd0ltTWFkZSgpXG4gICAgICAgIHJldHVybiBjaGlsZFxuICAgIH1cblxuICAgIGRlc2NyaWJlQWN0aW9ucygpIHtcbiAgICAgICAgY29uc3QgYWN0aW9ucyA9IFtdXG4gICAgICAgIGxldCBub2RlID0gdGhpc1xuICAgICAgICB3aGlsZSAobm9kZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBhY3Rpb25zLnVuc2hpZnQobm9kZS5wcmV2aW91c0FjdGlvbilcbiAgICAgICAgICAgIG5vZGUgPSBub2RlLnBhcmVudFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2VudGVuY2UgPSBhY3Rpb25zLmpvaW4oJyxcXG4nKVxuICAgICAgICByZXR1cm4gdGhpcy5maW5pc2goc2VudGVuY2UpXG4gICAgfVxuXG4gICAgZmluaXNoKHNlbnRlbmNlKSB7XG4gICAgICAgIGNvbnN0IG1lYXN1cmUgPSB0aGlzLmdldFRhcmdldGVkQm90dGxlKCkuY29udGVudFxuICAgICAgICBjb25zdCBzaWRlID0gdGhpcy5sZWZ0Lmhhc0JlZW5UYXJnZXRlZCgpID8gJ2xlZnQnIDogJ3JpZ2h0J1xuICAgICAgICBjb25zdCBsYXN0UGFydCA9ICcgYW5kXFxuICAgICBET05FISAgICAgIHlvdSBoYXZlICdcbiAgICAgICAgICAgICsgbWVhc3VyZSArICcgbGl0ZXJzIGluIHRoZSAnXG4gICAgICAgICAgICArIHNpZGUgKyAnIGJvdHRsZS4nXG4gICAgICAgIHJldHVybiBzZW50ZW5jZSArIGxhc3RQYXJ0XG4gICAgfVxuXG4gICAgZ2V0VGFyZ2V0ZWRCb3R0bGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxlZnQuaGFzQmVlblRhcmdldGVkKCkgPyB0aGlzLmxlZnQgOiB0aGlzLnJpZ2h0XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVHJlZSB7XG4gICAgY29uc3RydWN0b3IobGVmdEJvdHRsZSwgcmlnaHRCb3R0bGUpIHtcbiAgICAgICAgdGhpcy5ub2RlID0gbmV3IE5vZGUobGVmdEJvdHRsZSwgcmlnaHRCb3R0bGUpXG4gICAgICAgIHRoaXMucm9vdCA9IHRoaXMubm9kZVxuICAgIH1cblxuICAgIHRyYXZlcnNlQnJlYWR0aEZpcnN0KGl0SXNEZXNpcmVkKSB7XG4gICAgICAgIC8vIGNyZWF0ZSBxdWV1ZSB3aXRoIHJvb3Qgbm9kZVxuICAgICAgICBjb25zdCBxdWV1ZSA9IFt0aGlzLnJvb3RdXG4gICAgICAgIC8vIGRlcXVldWUgcm9vdCBub2RlXG4gICAgICAgIGxldCBjdXJyZW50Tm9kZSA9IHF1ZXVlLnNoaWZ0KClcblxuICAgICAgICB3aGlsZSAoY3VycmVudE5vZGUpIHtcbiAgICAgICAgICAgIGlmIChpdElzRGVzaXJlZChjdXJyZW50Tm9kZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudE5vZGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmIG5vdCB0aGUgZGVzaXJlZCBub2RlLCBxdWVxdWUgY2hpbGRyZW5cbiAgICAgICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY3VycmVudE5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBxdWV1ZS5wdXNoKGNoaWxkKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZGVxdWV1ZSBuZXh0IG5vZGUgdG8gbG9vayBhdFxuICAgICAgICAgICAgY3VycmVudE5vZGUgPSBxdWV1ZS5zaGlmdCgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBncm93KCkge1xuICAgICAgICB0aGlzLm5vZGUuZmlsbFBvdXJPclRyYW5zZmVyKClcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBnZXROb2RlKHRoYXRIYXNUaGVEZXNpcmVkTWVhc3VyZSkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmF2ZXJzZUJyZWFkdGhGaXJzdCh0aGF0SGFzVGhlRGVzaXJlZE1lYXN1cmUpXG4gICAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kKGRlc2lyZWRNZWFzdXJlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIGlmIChub2RlLmxlZnQuY29udGVudCA9PSBkZXNpcmVkTWVhc3VyZSkge1xuICAgICAgICAgICAgbm9kZS5sZWZ0LmlzVGFyZ2V0ZWQgPSB0cnVlXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9IGVsc2UgaWYgKG5vZGUucmlnaHQuY29udGVudCA9PSBkZXNpcmVkTWVhc3VyZSkge1xuICAgICAgICAgICAgbm9kZS5yaWdodC5pc1RhcmdldGVkID0gdHJ1ZVxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUuZmlsbFBvdXJPclRyYW5zZmVyKClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZSAvLyBhbmQga2VlcCBsb29raW5nXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IHByaW50SG93VG9HZXRUaGVyZSA9IChsZWZ0Vm9sdW1lLCByaWdodFZvbHVtZSwgZGVzaXJlZE1lYXN1cmUpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgbmV3IFRyZWUobmV3IEJvdHRsZShsZWZ0Vm9sdW1lKSwgbmV3IEJvdHRsZShyaWdodFZvbHVtZSkpXG4gICAgICAgICAgICAuZ2V0Tm9kZShmaW5kKGRlc2lyZWRNZWFzdXJlKSlcbiAgICAgICAgICAgIC5kZXNjcmliZUFjdGlvbnMoKVxuICAgIClcbn1cblxuZnVuY3Rpb24gbWFpbigpIHtcbiAgICBQUklOVC53ZWxjb21lKClcbiAgICBQUklOVC5tZWFzdXJlMSgpXG4gICAgcHJpbnRIb3dUb0dldFRoZXJlKDMsIDUsIDEpXG4gICAgUFJJTlQubWVhc3VyZTQoKVxuICAgIHByaW50SG93VG9HZXRUaGVyZSgzLCA1LCA0KVxuICAgIFBSSU5ULm1lYXN1cmU4ZnJvbUJvdHRsZXMxYW5kMjAoKVxuICAgIHByaW50SG93VG9HZXRUaGVyZSgxLCAyMCwgOClcbiAgICBQUklOVC5ieWUoKVxufVxuXG5tYWluKCkiXX0=