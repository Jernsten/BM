"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.sanityCheck = sanityCheck;exports.findMeasure = findMeasure;exports.main = exports.Tree = exports.Node = exports.Bottle = void 0;function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var

Bottle = /*#__PURE__*/function () {
  function Bottle(volume) {_classCallCheck(this, Bottle);
    this.volume = volume;
    this.content = 0;
    // if this bottle has the wanted measure
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

      if (canFit == 0 || canPour == 0) return; // cant fit anymore or nothing to pour over

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

    some) {// For test only
      this.content += some;
      return this;
    } }, { key: "take", value: function take(

    some) {// For test only
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
    // if (leftBottle != undefined && rightBottle != undefined)
    //     console.log("left: " + leftBottle.content + "| right: " + rightBottle.content)
    this.left = leftBottle;
    this.right = rightBottle;
    this.parent = null;
    this.children = [];
    this.previousAction = '\n  Take two empty bottles of ' +
    leftBottle.volume + ' and ' + rightBottle.volume + ' liters'; // The literal beginnings, will be overriten except for root
  }_createClass(Node, [{ key: "generateChildren2", value: function generateChildren2()

    {
      if (this.left.hasRoom()) {
        var leftCopy = this.left.copy().fillUp(),
        rightCopy = this.right.copy();
        this.createChildIfNotTwoEmptyOrFullBottles(leftCopy, rightCopy,
        ' fill up the left bottle (' + leftCopy.content + '|' + rightCopy.content + ')');
      }

      if (this.left.isNotEmpty()) {
        var _leftCopy = this.left.copy().pourOut(),
        _rightCopy = this.right.copy();
        this.createChildIfNotTwoEmptyOrFullBottles(_leftCopy, _rightCopy,
        ' pour out the left bottle (' + _leftCopy.content + '|' + _rightCopy.content + ')');
      }

      if (this.left.isNotEmpty() && this.right.hasRoom()) {
        var _leftCopy2 = this.left.copy(),
        _rightCopy2 = this.right.copy();
        _leftCopy2.pourOverTo(_rightCopy2);
        this.createChildIfNotTwoEmptyOrFullBottles(_leftCopy2, _rightCopy2,
        ' pour from the left bottle to the right bottle (' + _leftCopy2.content + '|' + _rightCopy2.content + ')');
      }

      if (this.right.hasRoom()) {
        var _leftCopy3 = this.left.copy(),
        _rightCopy3 = this.right.copy().fillUp();
        this.createChildIfNotTwoEmptyOrFullBottles(_leftCopy3, _rightCopy3,
        ' fill up the right bottle (' + _leftCopy3.content + '|' + _rightCopy3.content + ')');
      }

      if (this.right.isNotEmpty()) {
        var _leftCopy4 = this.left.copy(),
        _rightCopy4 = this.right.copy().pourOut();
        this.createChildIfNotTwoEmptyOrFullBottles(_leftCopy4, _rightCopy4,
        ' pour out the right bottle (' + _leftCopy4.content + '|' + _rightCopy4.content + ')');
      }

      if (this.right.isNotEmpty() && this.left.hasRoom()) {
        var _leftCopy5 = this.left.copy(),
        _rightCopy5 = this.right.copy();
        _rightCopy5.pourOverTo(_leftCopy5);
        this.createChildIfNotTwoEmptyOrFullBottles(_leftCopy5, _rightCopy5,
        ' pour from the right bottle to the left bottle (' + _leftCopy5.content + '|' + _rightCopy5.content + ')');
      }
    } }, { key: "generateChildren", value: function generateChildren()

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
        fillLeft: function fillLeft() {return ' fill up the left bottle ';},
        pourLeft: function pourLeft() {return ' pour out the left bottle ';},
        pourFromLeftToRight: function pourFromLeftToRight() {return ' pour from the left bottle to the right bottle ';},
        pourFromRightToLeft: function pourFromRightToLeft() {return ' pour from the right bottle to the left bottle ';},
        pourRight: function pourRight() {return ' pour out the right bottle ';},
        fillRight: function fillRight() {return ' fill up the right bottle ';} };


      for (var whatsPossible in preConditions) {
        if (preConditions[whatsPossible]()) {
          var child = parents.createChild(story[whatsPossible]);
          if (!bothBottlesFullOrEmpty(child)) {
            this.children.push(child);
          }
        }
      }

      function bothBottlesFullOrEmpty(child) {
        return child.left.isFull() && child.right.isFull() ||
        child.left.isEmpty() && child.right.isEmpty();
      }
    } }, { key: "createChild", value: function createChild(

    howImMade) {
      var left = this.left.copy(),right = this.left.copy();

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
      child.previousAction = '  ' + left.content + ' | ' + right.content + '  ' + howImMade();
      // console.log(child.previousAction)
      return child;
    } }, { key: "createChildIfNotTwoEmptyOrFullBottles", value: function createChildIfNotTwoEmptyOrFullBottles(
    left, right, action) {
      if (left.isEmpty() && right.isEmpty() ||
      left.isFull() && right.isFull())
      return; // do nothing

      var child = new Node(left, right);
      child.parent = this;
      child.previousAction = action + '( ' + left.content + ' | ' + right.content + ' )';
      this.children.push(child);
    } }, { key: "describeActions", value: function describeActions()

    {
      var actions = [];
      var node = this;
      while (node != null) {
        actions.unshift(node.previousAction);
        node = node.parent;
      }

      var sentence = actions.join(',\n');
      return this.finish(this, sentence);
    } }, { key: "finish", value: function finish(

    that, sentence) {
      var measure = that.getTargetedBottle().content;
      var side = this.left.hasBeenTargeted() ? 'left' : 'right';
      var lastPart = ' and\n  now you have ' + measure + ' liters in the ' + side + ' bottle!';
      return sentence + lastPart;
    } }, { key: "getTargetedBottle", value: function getTargetedBottle()

    {
      if (this.left.hasBeenTargeted())
      return this.left;else

      return this.right;
    } }]);return Node;}();exports.Node = Node;var


Tree = /*#__PURE__*/function () {
  function Tree(leftBottle, rightBottle) {_classCallCheck(this, Tree);
    this.node = new Node(leftBottle, rightBottle);
    this.root = this.node;
  }_createClass(Tree, [{ key: "traverseBreadthFirst", value: function traverseBreadthFirst(

    isTargeted) {
      var queue = [this.root]; // create queue with root node
      var currentNode = queue.shift(); // dequeue root node

      while (currentNode) {// while node exists
        if (isTargeted(currentNode)) {// check if desired node
          console.log('FOUND IT');
          return currentNode;
        }var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
          for (var _iterator = currentNode.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var child = _step.value;
            queue.push(child); // queque children
          }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator["return"] != null) {_iterator["return"]();}} finally {if (_didIteratorError) {throw _iteratorError;}}}

        currentNode = queue.shift(); // take next node
      }
    } }, { key: "grow", value: function grow()

    {
      this.node.generateChildren();
      return this;
    } }, { key: "getNode", value: function getNode(

    targetLogic) {
      return this.traverseBreadthFirst(targetLogic);
    } }]);return Tree;}();exports.Tree = Tree;


function sanityCheck() {return 'Test is working!';}

function findMeasure(desired) {
  return function (node) {
    console.log(desired);
    console.log(node);
    if (node.left.content == desired) {
      node.left.isTargeted = true;
      return true;
    } else if (node.right.content == desired) {
      node.right.isTargeted = true;
      return true;
    } else {
      node.generateChildren();
      return false; // and keep looking
    }
  };
}

// export function describeActionsFor(leftBottleVolume, rightBottleVolume, measure) {
//     return new Tree(new Bottle(leftBottleVolume), new Bottle(rightBottleVolume))
//         .getNode(findMeasure(measure))
//         .describeActions()
// }

var main = function main() {
  console.log("\n\u2591\u2591\u2591\u2591\u2591\u2593\u2588\u2588\u2588\u2593\n\u2591\u2591\u2591\u2591\u2593\u2588\u2588\u2588\u2588\u2588\u2593\n\u2591\u2591\u2591\u2591\u2593\u2588\u2588\u2588\u2588\u2588\u2593\n\u2591\u2591\u2591\u2591\u2591\u2593\u2588\u2588\u2588\u2593\n\u2591\u2591\u2591\u2591\u2591 *;;*\n\u2591\u2591\u2591\u2591\u2591* ;;*                                                     \u2593\u2588\u2588\u2588\u2593\n\u2591\u2591\u2591\u2591 * ;;*                                                    \u2593\u2588\u2588\u2588\u2588\u2588\u2593\n\u2591\u2591\u2591\u2591* ;;;;*                                                   \u2593\u2588\u2588\u2588\u2588\u2588\u2593\n\u2591\u2591\u2591\u2591\u2593\u2588\u2588\u2588\u2588\u2588\u2593                                                    \u2593\u2588\u2588\u2588\u2593\n\u2591\u2591\u2591\u2591\u2593\u2588\u2588\u2588\u2588\u2588\u2593                                                     *;;*\n\u2591\u2591\u2591\u2591\u2593\u2588\u2588\u2588\u2588\u2588\u2593                                                    * ;;*\n\u2591\u2591\u2591\u2593\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2593                                                   * ;;*\n\u2591\u2591\u2593\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2593                                                 * ;;;;*\n\u2591\u2593\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2593                                                \u2593\u2588\u2588\u2588\u2588\u2588\u2593\n\u2593\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2593                                               \u2593\u2588\u2588\u2588\u2588\u2588\u2593\n\u2593\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588\u2593                                              \u2593\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2593\n\u2593\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588\u2593   /\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\\      \u2593\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2593\n\u2593\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588\u2593   \u2588                                  \u2588     \u2593\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2593\n\u2593\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588\u2593   \u2588              Hello!              \u2588    \u2593\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2593\n\u2593\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588\u2593   \u2588                                  \u2588    \u2593\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588\u2593\n\u2593\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588\u2593   \u2588                                  \u2588    \u2593\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588\u2593\n\u2593\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588\u2593   \u2588   Do you want to know the best   \u2588    \u2593\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588\u2593\n\u2593\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588\u2593   \u2588    way to measure out 1 and 4    \u2588    \u2593\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588\u2593\n\u2593\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588\u2593   \u2588   liters with two bottles of 3   \u2588    \u2593\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588\u2593\n\u2593\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588\u2593   \u2588          and 5 liters?           \u2588    \u2593\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588\u2593\n\u2593\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588\u2593   \u2588                                  \u2588    \u2593\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588\u2593\n\u2591\u2593\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2593\u2591   \u2588                                  \u2588    \u2591\u2593\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2593\u2591\n\u2591\u2591\u2593\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2593\u2591    \\\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588/     \u2591\u2593\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2593\u2591\n\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\n");






























  console.log("\n\n\n /\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\\\n \u2588                    \u2588\n \u2588   Measure 1 liter  \u2588\n \u2588                    \u2588\n \\\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588/\n");








  // console.log(describeActionsFor(3, 5, 1))
  console.log("\n\n\n /\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\\\n \u2588                     \u2588\n \u2588   Measure 4 liters  \u2588\n \u2588                     \u2588\n \\\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588/\n");








  // console.log(describeActionsFor(3, 5, 4))
  console.log("\n\n\n /\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\\\n \u2588                                          \u2588\n \u2588   How to measure out 8 liters with two   \u2588\n \u2588    bottles of 1 and 20 liters takes a    \u2588\n \u2588     bit more time to calculate, but      \u2588\n \u2588    I will do it! Just take a few deep    \u2588\n \u2588     breaths while I figure it out...     \u2588\n \u2588                                          \u2588\n \\\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588/\n");












  // console.log(describeActionsFor(1, 17, 8))
};exports.main = main;

main();
//# sourceMappingURL=index.js.map