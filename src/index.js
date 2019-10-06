"use strict"
import { PRINT } from './art'
export const sanityCheck = () => 'Test is working!'

export class Bottle {
    constructor(volume) {
        this.volume = volume
        this.content = 0
        // if this bottle has the desired measure
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
        // cant fit anymore or nothing to pour over
        if (canFit == 0 || canPour == 0) return
        // else
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

    add(some) {
        this.content += some
        return this
    }

    take(some) {
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
        this.left = leftBottle
        this.right = rightBottle
        this.parent = null
        this.children = []

        // The literal beginnings, will be overriten except for root node
        this.previousAction = '\n ___' + leftBottle.volume + '_____'
            + rightBottle.volume + '___  Take two empty bottles of '
            + leftBottle.volume + ' and ' + rightBottle.volume + ' liters'
    }

    fillPourOrTransfer() {
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
                if (!this.bothBottlesFullOrEmpty(child)) {
                    this.children.push(child)
                }
            }
        }
    }
    bothBottlesFullOrEmpty(child) {
        return ((child.left.isFull() && child.right.isFull()) ||
            (child.left.isEmpty() && child.right.isEmpty()))
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
        child.previousAction = ' |  ' + left.content + '  |  ' + right.content + '  | ' + howImMade()
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
        return this.finish(sentence)
    }

    finish(sentence) {
        const measure = this.getTargetedBottle().content
        const side = this.left.hasBeenTargeted() ? 'left' : 'right'
        const lastPart = ' and\n     DONE!      you have '
            + measure + ' liters in the '
            + side + ' bottle.'
        return sentence + lastPart
    }

    getTargetedBottle() {
        return this.left.hasBeenTargeted() ? this.left : this.right
    }
}

export class Tree {
    constructor(leftBottle, rightBottle) {
        this.node = new Node(leftBottle, rightBottle)
        this.root = this.node
    }

    traverseBreadthFirst(itIsDesired) {
        // create queue with root node
        const queue = [this.root]
        // dequeue root node
        let currentNode = queue.shift()

        while (currentNode) {
            if (itIsDesired(currentNode)) {
                return currentNode
            }
            // if not the desired node, queque children
            for (const child of currentNode.children) {
                queue.push(child)
            }
            // dequeue next node to look at
            currentNode = queue.shift()
        }
    }

    grow() {
        this.node.fillPourOrTransfer()
        return this
    }

    getNode(thatHasTheDesiredMeasure) {
        return this.traverseBreadthFirst(thatHasTheDesiredMeasure)
    }
}


export function find(desiredMeasure) {
    return function (node) {
        if (node.left.content == desiredMeasure) {
            node.left.isTargeted = true
            return true
        } else if (node.right.content == desiredMeasure) {
            node.right.isTargeted = true
            return true
        } else {
            node.fillPourOrTransfer()
            return false // and keep looking
        }
    }
}

const printHowToGetThere = (leftVolume, rightVolume, desiredMeasure) => {
    console.log(
        new Tree(new Bottle(leftVolume), new Bottle(rightVolume))
            .getNode(find(desiredMeasure))
            .describeActions()
    )
}

function main() {
    PRINT.welcome()
    PRINT.measure1()
    printHowToGetThere(3, 5, 1)
    PRINT.measure4()
    printHowToGetThere(3, 5, 4)
    PRINT.measure8fromBottles1and20()
    printHowToGetThere(1, 20, 8)
    PRINT.bye()
}

main()