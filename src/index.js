"use strict"
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
        this.previousAction = '\nTake two empty bottles of '
            + leftBottle.volume + ' and ' + rightBottle.volume + ' liters' // The literal beginnings, will be overriten except for root
    }

    generateChildren() {
        if (this.left.hasRoom()) {
            const leftCopy = this.left.copy().fillUp(),
                rightCopy = this.right.copy()
            this.addIfNotTwoEmptyOrFullBottles(leftCopy, rightCopy,
                'fill up the left bottle')
        }

        if (this.left.isNotEmpty()) {
            const leftCopy = this.left.copy().pourOut(),
                rightCopy = this.right.copy()
            this.addIfNotTwoEmptyOrFullBottles(leftCopy, rightCopy,
                'pour out the left bottle')
        }

        if (this.left.isNotEmpty() && this.right.hasRoom()) {
            const leftCopy = this.left.copy(),
                rightCopy = this.right.copy()
            leftCopy.pourOverTo(rightCopy)
            this.addIfNotTwoEmptyOrFullBottles(leftCopy, rightCopy,
                'pour from the left bottle to the right bottle')
        }

        if (this.right.hasRoom()) {
            const leftCopy = this.left.copy(),
                rightCopy = this.right.copy().fillUp()
            this.addIfNotTwoEmptyOrFullBottles(leftCopy, rightCopy,
                'fill up the right bottle')
        }

        if (this.right.isNotEmpty()) {
            const leftCopy = this.left.copy(),
                rightCopy = this.right.copy().pourOut()
            this.addIfNotTwoEmptyOrFullBottles(leftCopy, rightCopy,
                'pour out the right bottle')
        }

        if (this.right.isNotEmpty() && this.left.hasRoom()) {
            const leftCopy = this.left.copy(),
                rightCopy = this.right.copy()
            rightCopy.pourOverTo(leftCopy)
            this.addIfNotTwoEmptyOrFullBottles(leftCopy, rightCopy,
                'pour from the right bottle to the left bottle')
        }
    }

    addIfNotTwoEmptyOrFullBottles(left, right, action) {
        if ((left.isEmpty() && right.isEmpty()) ||
            (left.isFull() && right.isFull()))
            return

        const child = new Node(left, right)
        child.parent = this
        child.previousAction = action
        this.children.push(child)
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
        const lastPart = ' and\nthats how you measure out ' + that.getTargetedBottle().content + ' liters!'
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

    // traverseDepthFirst(callback) {

    //     function recurse(currentNode) {
    //         for (const child of currentNode.children) {
    //             recurse(child)
    //         }
    //         callback(currentNode)
    //     }

    //     recurse(this.root)
    // }

    traverseBreadthFirst(isTheNode) {
        const queue = [this.root]               // create queue with root node
        let currentNode = queue.shift()         // dequeue root node

        while (currentNode) {   // while node exists
            if (isTheNode(currentNode)) {             // check if desired node
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

    contains(filterLogic) {
        return this.traverseBreadthFirst(filterLogic)
    }

    find(target) {
        return function (node) {
            if (node.left.content == target) {
                node.left.isTargeted = true
                return true
            } else if (node.right.content == target) {
                node.right.isTargeted = true
                return true
            } else {
                node.generateChildren()
            }
        }
    }
}

export const sanityCheck = () => 'Test is working!'


function main() {

    const tree = new Tree(new Bottle(1), new Bottle(10))
    const nodeWith5l = tree.contains(tree.find(7))
    console.log(nodeWith5l.describeActions())
}

main()