"use strict"
import { PRINT } from './art'

export class Bottle {
    constructor(volume) {
        this.volume = volume
        this.content = 0
        // if this bottle has the wanted measure
        this.isTargeted = false
    }

    fillUp() {
        this.content = this.volume
        return this
    }

    pourOut() {
        this.content = 0
        return this
    }

    pourOverTo(otherBottle) {
        const canPour = this.content
        const canFit = otherBottle.volume - otherBottle.content

        if (canFit == 0 || canPour == 0) return // cant fit anymore or nothing to pour over

        const amountToPour = canFit <= canPour ? canFit : canPour
        otherBottle.content += amountToPour
        this.content -= amountToPour
    }

    hasRoom() {
        return (this.volume - this.content) > 0
    }

    isNotEmpty() {
        return this.content > 0
    }

    isEmpty() {
        return this.content == 0
    }

    isFull() {
        return this.content == this.volume
    }

    add(some) { // For test only
        this.content += some
        return this
    }

    take(some) { // For test only
        this.content -= some
        return this
    }

    copy() {
        return new Bottle(this.volume).add(this.content)
    }

    hasBeenTargeted() {
        return this.isTargeted
    }
}

export class Node {
    constructor(leftBottle, rightBottle) {
        // if (leftBottle != undefined && rightBottle != undefined)
        //     console.log("left: " + leftBottle.content + "| right: " + rightBottle.content)
        this.left = leftBottle
        this.right = rightBottle
        this.parent = null
        this.children = []
        this.previousAction = '\n___' + leftBottle.volume + '_____' + rightBottle.volume + '___  Take two empty bottles of '
            + leftBottle.volume + ' and ' + rightBottle.volume + ' liters' // The literal beginnings, will be overriten except for root
    }

    generateChildren() {
        const parents = this

        const preConditions = {
            fillLeft: () => parents.left.hasRoom(),
            pourLeft: () => parents.left.isNotEmpty(),
            pourFromLeftToRight: () => parents.left.isNotEmpty() && parents.right.hasRoom(),
            pourFromRightToLeft: () => parents.right.isNotEmpty() && parents.left.hasRoom(),
            pourRight: () => parents.right.isNotEmpty(),
            fillRight: () => parents.right.hasRoom()
        }

        const story = {
            fillLeft: () => ' fill up the left bottle',
            pourLeft: () => ' pour out the left bottle',
            pourFromLeftToRight: () => ' pour from the left bottle to the right bottle',
            pourFromRightToLeft: () => ' pour from the right bottle to the left bottle',
            pourRight: () => ' pour out the right bottle',
            fillRight: () => ' fill up the right bottle'
        }

        for (const whatsPossible in preConditions) {
            if (preConditions[whatsPossible]()) {
                const child = parents.createChild(story[whatsPossible])
                if (!bothBottlesFullOrEmpty(child)) {
                    this.children.push(child)
                }
            }
        }

        function bothBottlesFullOrEmpty(child) {
            return ((child.left.isFull() && child.right.isFull()) ||
                (child.left.isEmpty() && child.right.isEmpty()))
        }
    }

    createChild(howImMade) {
        const left = this.left.copy(), right = this.right.copy()

        switch (howImMade.name) {
            case 'fillLeft':
                left.fillUp()
                break
            case 'pourLeft':
                left.pourOut()
                break
            case 'pourFromLeftToRight':
                left.pourOverTo(right)
                break
            case 'pourFromRightToLeft':
                right.pourOverTo(left)
                break
            case 'pourRight':
                right.pourOut()
                break
            case 'fillRight':
                right.fillUp()
                break
        }
        const child = new Node(left, right)
        child.parent = this
        child.previousAction = '|  ' + left.content + '  |  ' + right.content + '  | ' + howImMade()
        return child
    }

    describeActions() {
        const actions = []
        let node = this
        while (node != null) {
            actions.unshift(node.previousAction)
            node = node.parent
        }

        const sentence = actions.join(',\n')
        return this.finish(this, sentence)
    }

    finish(that, sentence) {
        const measure = that.getTargetedBottle().content
        const side = this.left.hasBeenTargeted() ? 'left' : 'right'
        const lastPart = ' and\n    DONE!      you have ' + measure + ' liters in the ' + side + ' bottle.'
        return sentence + lastPart
    }

    getTargetedBottle() {
        if (this.left.hasBeenTargeted())
            return this.left
        else
            return this.right
    }
}

export class Tree {
    constructor(leftBottle, rightBottle) {
        this.node = new Node(leftBottle, rightBottle)
        this.root = this.node
    }

    traverseBreadthFirst(isTargeted) {
        const queue = [this.root]               // create queue with root node
        let currentNode = queue.shift()         // dequeue root node

        while (currentNode) {                   // while node exists
            if (isTargeted(currentNode)) {           // check if desired node
                return currentNode
            }
            for (const child of currentNode.children) {
                queue.push(child)                   // queque children
            }

            currentNode = queue.shift()             // take next node
        }
    }

    grow() {
        this.node.generateChildren()
        return this
    }

    getNode(targetLogic) {
        return this.traverseBreadthFirst(targetLogic)
    }
}

export function sanityCheck() { return 'Test is working!' }

export function find(desiredMeasure) {
    return function (node) {
        if (node.left.content == desiredMeasure) {
            node.left.isTargeted = true
            return true
        } else if (node.right.content == desiredMeasure) {
            node.right.isTargeted = true
            return true
        } else {
            node.generateChildren()
            return false // and keep looking
        }
    }
}

const printHowToGetThere = (leftVolume, rightVolume, wantedMeasure)=> {
    console.log(
        new Tree(new Bottle(leftVolume), new Bottle(rightVolume))
            .getNode(find(wantedMeasure))
            .describeActions()
    )
}

export const main = function () {
    PRINT.welcome()
    PRINT.measure1()
    printHowToGetThere(3, 5, 1)
    PRINT.border()
    PRINT.measure4()
    printHowToGetThere(3, 5, 4)
    PRINT.border()
    PRINT.measure8fromBottles1and20()
    // printHowToGetThere(20, 1, 8)
    PRINT.bye()
    console.log('\n\n')
}

main()