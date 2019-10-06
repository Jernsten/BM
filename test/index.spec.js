"use strict"
import { expect } from 'chai'
import { describe, it } from 'mocha'
import { Bottle, find, Node, sanityCheck, Tree } from '../src/index'

describe('TEST SUITE', () => {
    it('Should work', () => {
        expect(sanityCheck()).to.equal('Test is working!')
    })
})

describe('BOTTLES', () => {
    it('Should create a bottle', () => {
        expect(new Bottle()).to.be.an.instanceOf(Bottle)
    })

    it('Should have a volume', () => {
        expect(new Bottle()).to.have.ownProperty('volume')
    })

    it('Should create a bottle with 3l volume', () => {
        const volume = 3
        expect(new Bottle(volume)).to.have.property('volume').that.equals(volume)
    })

    it('Should have 0l content in bottle', () => {
        const empty = 0
        expect(new Bottle()).to.have.property('content').that.equals(empty)
    })

    it('Should fill bottle to max', () => {
        const volume = 5
        expect(new Bottle(volume).fillUp()).to.have.property('content').that.equals(volume)
    })

    it('Should empty the bottle completely', () => {
        const volume = 5
        const bottle = new Bottle(volume).fillUp()
        expect(bottle.pourOut()).to.have.property('content').that.equals(0)
    })

    it('Should deep copy bottle object', () => {
        const bottle = new Bottle(1).fillUp()
        const bottleCopy = bottle.copy()
        bottle.pourOut()
        expect(bottleCopy.content).to.equal(1)
    })
})

describe('TRANSACTIONS', () => {
    it('Should transfer all content from one bottle to the other', () => {
        const volume = 5
        const fullBottle = new Bottle(volume).fillUp()
        const emptyBottle = new Bottle(volume)

        fullBottle.pourOverTo(emptyBottle)

        expect(fullBottle.content).to.equal(0)
        expect(emptyBottle.content).to.equal(volume)
    })

    it('Should transfer content until other bottle is full', () => {
        const volume = 4, full = 4, halfFull = 2
        const fullBottle = new Bottle(volume).fillUp()
        const halfFullBottle = new Bottle(volume).add(halfFull)

        fullBottle.pourOverTo(halfFullBottle)

        expect(fullBottle.content).to.equal(halfFull)
        expect(halfFullBottle.content).to.equal(full)
    })

    it('Should transfer till other bottle is full and keep whats left', () => {
        const volume = 5
        let some = 3, someMore = 4

        const aBottle = new Bottle(volume).add(some) // 3
        const anotherBottle = new Bottle(volume).add(someMore) // 4

        aBottle.pourOverTo(anotherBottle) // give 1 from aBottle to anotherBottle

        expect(aBottle.content).to.equal(--some) // take 1
        expect(anotherBottle.content).to.equal(++someMore) // give 1
    })

    it('Should not be able to transfer from empty bottle', () => {
        const volume = 5

        const emptyBottle = new Bottle(volume)
        const anotherEmptyBottle = new Bottle(volume)

        emptyBottle.pourOverTo(anotherEmptyBottle)

        expect(emptyBottle.content).to.equal(0)
        expect(anotherEmptyBottle.content).to.equal(0) // both were empty to begin with, nothing to transfer
    })

    it('Should empty one bottle to other, none of them are full', () => {
        const volume = 5
        let some = 1, someMore = 2

        const aBottle = new Bottle(volume).add(some) //1
        const otherBottle = new Bottle(volume).add(someMore) //2

        aBottle.pourOverTo(otherBottle)

        expect(aBottle.content).to.equal(--some) // take 1
        expect(otherBottle.content).to.equal(++someMore) // give 1
    })

    it('Should not be able to transfer to full bottle', () => {
        const volume = 5, some = 3

        const aBottle = new Bottle(volume).add(some) // 3
        const anotherBottle = new Bottle(volume).fillUp() // 5

        aBottle.pourOverTo(anotherBottle)

        expect(aBottle.content).to.equal(some) // 3
        expect(anotherBottle.content).to.equal(volume) // 5
    })
})

describe('NODES', () => {
    it('Should create a Node with two bottles as parameters', () => {
        const volume3 = 3, volume5 = 5,
            left = new Bottle(volume3),
            right = new Bottle(volume5),
            node = new Node(left, right)
        expect(node.left).to.be.an.instanceOf(Bottle)
        expect(node.right).to.be.an.instanceOf(Bottle)
    })

    it('Should not have a parent', () => {
        const volume3 = 3, volume5 = 5,
            left = new Bottle(volume3),
            right = new Bottle(volume5),
            node = new Node(left, right)
        expect(node.parent).to.be.null
    })

    it('Should have room for children', () => {
        const volume3 = 3, volume5 = 5,
            left = new Bottle(volume3),
            right = new Bottle(volume5),
            node = new Node(left, right)
        expect(node.children).to.be.an.instanceOf(Array)
    })
})

describe('TREE', () => {
    it('Should create a Tree with root node', () => {
        const tree = new Tree(new Bottle(3), new Bottle(5))
        expect(tree.root).to.be.an.instanceOf(Node)
    })

    it('Should add a child node to tree root node', () => {
        const tree = new Tree(new Bottle(3), new Bottle(5))
        tree.root.children.push(new Node(new Bottle(1), new Bottle(2)))
        expect(tree.root.children[0]).to.be.an.instanceOf(Node)
        expect(tree.root.children[0].left.volume).to.equal(1)
        expect(tree.root.children[0].right.volume).to.equal(2)
    })

    it('Should have a traverseBreadthFirst method', () => {
        const tree = new Tree(new Bottle(3), new Bottle(5))
        expect(tree).to.respondTo('traverseBreadthFirst')
    })

})

describe('GENERATING NODES', () => {
    it('Should grow and generate children', () => {
        const left = new Bottle(3), right = new Bottle(5), tree = new Tree(left, right)
        tree.grow()
        expect(tree.root.children).to.be.an.instanceOf(Array)
        expect(tree.root.children[0]).to.be.an.instanceOf(Node)
        expect(tree.root.children[1]).to.be.an.instanceOf(Node)
        // only 2 children should be created
        expect(tree.root.children[2]).to.equal(undefined)
    })
})

describe('SEARCHING', () => {

    const pathTo1l = `
___3_____5___  Take two empty bottles of 3 and 5 liters,
|  3  |  0  |  fill up the left bottle,
|  0  |  3  |  pour from the left bottle to the right bottle,
|  3  |  3  |  fill up the left bottle,
|  1  |  5  |  pour from the left bottle to the right bottle and
    DONE!      you have 1 liters in the left bottle.`

    const pathTo4l = `
___3_____5___  Take two empty bottles of 3 and 5 liters,
|  0  |  5  |  fill up the right bottle,
|  3  |  2  |  pour from the right bottle to the left bottle,
|  0  |  2  |  pour out the left bottle,
|  2  |  0  |  pour from the right bottle to the left bottle,
|  2  |  5  |  fill up the right bottle,
|  3  |  4  |  pour from the right bottle to the left bottle and
    DONE!      you have 4 liters in the right bottle.`

    it('Should describe how to get to node with 1 liters', () => {
        const tree = new Tree(new Bottle(3), new Bottle(5))
        const nodeWith1l = tree.getNode(find(1))
        const description1l = nodeWith1l.describeActions()

        expect(description1l).to.equal(pathTo1l)
    })

    it('Should measure 4 liters', () => {
        const tree = new Tree(new Bottle(3), new Bottle(5))
        const description4l = tree.getNode(find(4)).describeActions()

        expect(description4l).to.equal(pathTo4l)
    })
})