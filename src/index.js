"use strict"
export class Bottle {
    constructor(volume) {
        this.volume = volume
        this.content = 0
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
}

export class Node {
    constructor(leftBottle, rightBottle) {
        // if (leftBottle != undefined && rightBottle != undefined)
        //     console.log("left: " + leftBottle.content + "| right: " + rightBottle.content)
        this.left = leftBottle
        this.right = rightBottle
        this.parent = null
        this.children = []
        this.previousAction = 'Take two empty bottles of 3 and 5 liters' // The beginnings, will persist on root node
    }

    generateChildren() {
        if (this.left.hasRoom()) {
            const leftCopy = this.left.copy().fillUp(),
                rightCopy = this.right.copy()
            this.addIfNotTwoEmptyOrFullBottles(leftCopy, rightCopy,
                'Fill up the left bottle')
        }

        if (this.left.isNotEmpty()) {
            const leftCopy = this.left.copy().pourOut(),
                rightCopy = this.right.copy()
            this.addIfNotTwoEmptyOrFullBottles(leftCopy, rightCopy,
                'Pour out the left bottle')
        }

        if (this.left.isNotEmpty() && this.right.hasRoom()) {
            const leftCopy = this.left.copy(),
                rightCopy = this.right.copy()
            leftCopy.pourOverTo(rightCopy)
            this.addIfNotTwoEmptyOrFullBottles(leftCopy, rightCopy,
                'Pour from the left bottle to the right bottle')
        }

        if (this.right.hasRoom()) {
            const leftCopy = this.left.copy(),
                rightCopy = this.right.copy().fillUp()
            this.addIfNotTwoEmptyOrFullBottles(leftCopy, rightCopy,
                'Fill up the right bottle')
        }

        if (this.right.isNotEmpty()) {
            const leftCopy = this.left.copy(),
                rightCopy = this.right.copy().pourOut()
            this.addIfNotTwoEmptyOrFullBottles(leftCopy, rightCopy,
                'Pour out the right bottle')
        }

        if (this.right.isNotEmpty() && this.left.hasRoom()) {
            const leftCopy = this.left.copy(),
                rightCopy = this.right.copy()
            rightCopy.pourOverTo(leftCopy)
            this.addIfNotTwoEmptyOrFullBottles(leftCopy, rightCopy,
                'Pour from the right bottle to the left bottle')
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
        const sentence = []
        let node = this
        while (node != null) {
            sentence.unshift(node.previousAction)
            node = node.parent
        }
        return sentence.join('\n')
    }
}

export class Tree {
    constructor(leftBottle, rightBottle) {
        this.node = new Node(leftBottle, rightBottle)
        this.root = this.node
    }

    traverseDepthFirst(callback) {

        function recurse(currentNode) {
            for (const child of currentNode.children) {
                recurse(child)
            }
            callback(currentNode)
        }

        recurse(this.root)
    }

    traverseBreadthFirst(isTheNode) {
        const queue = [this.root]               // create queue with root node
        let currentNode = queue.shift()         // dequeue root node

        while (currentNode) {   // while node exists
            // console.log('LOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOPING')
            // console.log(currentNode)

            if (isTheNode(currentNode)) {           // check if desired node
                return currentNode;
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
}

export const sanityCheck = () => 'Test is working!'