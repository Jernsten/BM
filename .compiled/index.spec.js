"use strict";
var _chai = require("chai");
var _mocha = require("mocha");
var _index = require("../src/index");

(0, _mocha.describe)('TEST SUITE', function () {
  (0, _mocha.it)('Should work', function () {
    (0, _chai.expect)((0, _index.sanityCheck)()).to.equal('Test is working!');
  });
});

(0, _mocha.describe)('BOTTLES', function () {
  (0, _mocha.it)('Should create a bottle', function () {
    (0, _chai.expect)(new _index.Bottle()).to.be.an.instanceOf(_index.Bottle);
  });

  (0, _mocha.it)('Should have a volume', function () {
    (0, _chai.expect)(new _index.Bottle()).to.have.ownProperty('volume');
  });

  (0, _mocha.it)('Should create a bottle with 3l volume', function () {
    var volume = 3;
    (0, _chai.expect)(new _index.Bottle(volume)).to.have.property('volume').that.equals(volume);
  });

  (0, _mocha.it)('Should have 0l content in bottle', function () {
    var empty = 0;
    (0, _chai.expect)(new _index.Bottle()).to.have.property('content').that.equals(empty);
  });

  (0, _mocha.it)('Should fill bottle to max', function () {
    var volume = 5;
    (0, _chai.expect)(new _index.Bottle(volume).fillUp()).to.have.property('content').that.equals(volume);
  });

  (0, _mocha.it)('Should empty the bottle completely', function () {
    var volume = 5;
    var bottle = new _index.Bottle(volume).fillUp();
    (0, _chai.expect)(bottle.pourOut()).to.have.property('content').that.equals(0);
  });

  (0, _mocha.it)('Should deep copy bottle object', function () {
    var bottle = new _index.Bottle(1).fillUp();
    var bottleCopy = bottle.copy();
    bottle.pourOut();
    (0, _chai.expect)(bottleCopy.content).to.equal(1);
  });
});

(0, _mocha.describe)('TRANSACTIONS', function () {
  (0, _mocha.it)('Should transfer all content from one bottle to the other', function () {
    var volume = 5;
    var fullBottle = new _index.Bottle(volume).fillUp();
    var emptyBottle = new _index.Bottle(volume);

    fullBottle.pourOverTo(emptyBottle);

    (0, _chai.expect)(fullBottle.content).to.equal(0);
    (0, _chai.expect)(emptyBottle.content).to.equal(volume);
  });

  (0, _mocha.it)('Should transfer content until other bottle is full', function () {
    var volume = 4,full = 4,halfFull = 2;
    var fullBottle = new _index.Bottle(volume).fillUp();
    var halfFullBottle = new _index.Bottle(volume).add(halfFull);

    fullBottle.pourOverTo(halfFullBottle);

    (0, _chai.expect)(fullBottle.content).to.equal(halfFull);
    (0, _chai.expect)(halfFullBottle.content).to.equal(full);
  });

  (0, _mocha.it)('Should transfer till other bottle is full and keep whats left', function () {
    var volume = 5;
    var some = 3,someMore = 4;

    var aBottle = new _index.Bottle(volume).add(some); // 3
    var anotherBottle = new _index.Bottle(volume).add(someMore); // 4

    aBottle.pourOverTo(anotherBottle); // give 1 from aBottle to anotherBottle

    (0, _chai.expect)(aBottle.content).to.equal(--some); // take 1
    (0, _chai.expect)(anotherBottle.content).to.equal(++someMore); // give 1
  });

  (0, _mocha.it)('Should not be able to transfer from empty bottle', function () {
    var volume = 5;

    var emptyBottle = new _index.Bottle(volume);
    var anotherEmptyBottle = new _index.Bottle(volume);

    emptyBottle.pourOverTo(anotherEmptyBottle);

    (0, _chai.expect)(emptyBottle.content).to.equal(0);
    (0, _chai.expect)(anotherEmptyBottle.content).to.equal(0); // both were empty to begin with, nothing to transfer
  });

  (0, _mocha.it)('Should empty one bottle to other, none of them are full', function () {
    var volume = 5;
    var some = 1,someMore = 2;

    var aBottle = new _index.Bottle(volume).add(some); //1
    var otherBottle = new _index.Bottle(volume).add(someMore); //2

    aBottle.pourOverTo(otherBottle);

    (0, _chai.expect)(aBottle.content).to.equal(--some); // take 1
    (0, _chai.expect)(otherBottle.content).to.equal(++someMore); // give 1
  });

  (0, _mocha.it)('Should not be able to transfer to full bottle', function () {
    var volume = 5,some = 3;

    var aBottle = new _index.Bottle(volume).add(some); // 3
    var anotherBottle = new _index.Bottle(volume).fillUp(); // 5

    aBottle.pourOverTo(anotherBottle);

    (0, _chai.expect)(aBottle.content).to.equal(some); // 3
    (0, _chai.expect)(anotherBottle.content).to.equal(volume); // 5
  });
});

(0, _mocha.describe)('NODES', function () {
  (0, _mocha.it)('Should create a Node with two bottles as parameters', function () {
    var volume3 = 3,volume5 = 5,
    left = new _index.Bottle(volume3),
    right = new _index.Bottle(volume5),
    node = new _index.Node(left, right);
    (0, _chai.expect)(node.left).to.be.an.instanceOf(_index.Bottle);
    (0, _chai.expect)(node.right).to.be.an.instanceOf(_index.Bottle);
  });

  (0, _mocha.it)('Should have a parent', function () {
    var volume3 = 3,volume5 = 5,
    left = new _index.Bottle(volume3),
    right = new _index.Bottle(volume5),
    node = new _index.Node(left, right);
    (0, _chai.expect)(node.parent).to.be["null"];
  });

  (0, _mocha.it)('Should have children', function () {
    var volume3 = 3,volume5 = 5,
    left = new _index.Bottle(volume3),
    right = new _index.Bottle(volume5),
    node = new _index.Node(left, right);
    (0, _chai.expect)(node.children).to.be.an.instanceOf(Array);
  });
});

(0, _mocha.describe)('TREE', function () {
  (0, _mocha.it)('Should create a Tree with root node', function () {
    var tree = new _index.Tree(new _index.Bottle(3), new _index.Bottle(5));
    (0, _chai.expect)(tree.root).to.be.an.instanceOf(_index.Node);
  });

  (0, _mocha.it)('Should have a root node', function () {
    var tree = new _index.Tree(new _index.Bottle(3), new _index.Bottle(5));
    (0, _chai.expect)(tree.root).to.be.an.instanceOf(_index.Node);
  });

  (0, _mocha.it)('Should have a traverseBreadthFirst method', function () {
    var tree = new _index.Tree(new _index.Bottle(3), new _index.Bottle(5));
    (0, _chai.expect)(tree).to.respondTo('traverseBreadthFirst');
  });

  (0, _mocha.it)('Should add a child node to tree root node', function () {
    var tree = new _index.Tree(new _index.Bottle(3), new _index.Bottle(5));
    tree.root.children.push(new _index.Node(new _index.Bottle(1), new _index.Bottle(2)));
    (0, _chai.expect)(tree.root.children[0]).to.be.an.instanceOf(_index.Node);
    (0, _chai.expect)(tree.root.children[0].left.volume).to.equal(1);
    (0, _chai.expect)(tree.root.children[0].right.volume).to.equal(2);
  });
});

(0, _mocha.describe)('GENERATING NODES', function () {
  (0, _mocha.it)('Should grow and generate children', function () {
    var left = new _index.Bottle(3),right = new _index.Bottle(5),tree = new _index.Tree(left, right);
    tree.grow();
    (0, _chai.expect)(tree.root.children).to.be.an.instanceOf(Array);
    (0, _chai.expect)(tree.root.children[0]).to.be.an.instanceOf(_index.Node); // fill left
    (0, _chai.expect)(tree.root.children[1]).to.be.an.instanceOf(_index.Node); // fill right
    (0, _chai.expect)(tree.root.children[2]).to.equal(undefined); // only 2 children should be created
  });
});

(0, _mocha.describe)('SEARCHING', function () {

  var pathTo1l = "\n  Take two empty bottles of 3 and 5 liters,\n fill up the left bottle (3|0),\n pour from the left bottle to the right bottle (0|3),\n fill up the left bottle (3|3),\n pour from the left bottle to the right bottle (1|5) and\n  now you have 1 liters in the left bottle!";







  var pathTo4l = "\n  Take two empty bottles of 3 and 5 liters,\n fill up the right bottle (0|5),\n pour from the right bottle to the left bottle (3|2),\n pour out the left bottle (0|2),\n pour from the right bottle to the left bottle (2|0),\n fill up the right bottle (2|5),\n pour from the right bottle to the left bottle (3|4) and\n  now you have 4 liters in the right bottle!";









  (0, _mocha.it)('Should describe how to get to node with 1 liters', function () {
    var tree = new _index.Tree(new _index.Bottle(3), new _index.Bottle(5));
    var nodeWith1l = tree.getNode((0, _index.findMeasure)(1));
    var description1l = nodeWith1l.describeActions();

    (0, _chai.expect)(description1l).to.equal(pathTo1l);
  });

  (0, _mocha.it)('Should measure 4 liters', function () {
    var tree = new _index.Tree(new _index.Bottle(3), new _index.Bottle(5));
    var description4l = tree.getNode((0, _index.findMeasure)(4)).describeActions();

    (0, _chai.expect)(description4l).to.equal(pathTo4l);
  });
});
//# sourceMappingURL=index.spec.js.map