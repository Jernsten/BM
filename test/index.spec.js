"use strict"
import { expect } from 'chai'
import { sanityCheck, Bottle, Node, Tree } from '../src/index'

describe('SANITY CHECK', () => {
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

    it('Should have a parent', () => {
        const volume3 = 3, volume5 = 5,
            left = new Bottle(volume3),
            right = new Bottle(volume5),
            node = new Node(left, right)
        expect(node.parent).to.be.null
    })

    it('Should have children', () => {
        const volume3 = 3, volume5 = 5,
            left = new Bottle(volume3),
            right = new Bottle(volume5),
            node = new Node(left, right)
        expect(node.children).to.be.an.instanceOf(Array)
    })
})

describe('TREE', () => {
    it('Should create a Tree object', () => {
        expect(new Tree()).to.be.an.instanceOf(Tree)
    })

    it('Should have a node', () => {
        const tree = new Tree(new Bottle(3), new Bottle(5))
        expect(tree.node).to.be.an.instanceOf(Node)
    })

    it('Should have a root node', () => {
        const tree = new Tree(new Bottle(3), new Bottle(5))
        expect(tree.root).to.be.an.instanceOf(Node)
    })

    it('Should have a traverseDepthFirst method', () => {
        const tree = new Tree(new Bottle(3), new Bottle(5))
        expect(tree).to.respondTo('traverseDepthFirst')
    })

    it('Should have a traverseBreadthFirst method', () => {
        const tree = new Tree(new Bottle(3), new Bottle(5))
        expect(tree).to.respondTo('traverseBreadthFirst')
    })

    it('Should add a child node to tree root node', () => {
        const tree = new Tree(new Bottle(3), new Bottle(5))
        tree.root.children.push(new Node(new Bottle(1), new Bottle(2)))
        expect(tree.root.children[0]).to.be.an.instanceOf(Node)
        expect(tree.root.children[0].left.volume).to.equal(1)
        expect(tree.root.children[0].right.volume).to.equal(2)
    })
})

describe('PROBLEM SOLVING', () => {
    it('Should generate children', () => {
        const left = new Bottle(3), right = new Bottle(5),
            tree = new Tree(left, right)
        const children = tree.root.generateChildren()
        expect(children).to.be.an.Array()
    })
})