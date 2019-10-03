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
        const canFit = this.volume - this.content

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
        this.left = leftBottle
        this.right = rightBottle
        this.parent = null
        this.children = Array()
    }

    generateChildren() {
        // FILL UP LEFT BOTTLE
        if (this.left.hasRoom()) {
            const leftCopy = this.left.copy().fillUp(),
                rightCopy = this.right.copy()
            if (this.isNotSameAsBaseCondition(leftCopy, rightCopy))
                this.children.push(new Node(leftCopy, rightCopy))
        }
        // POUR OUT LEFT BOTTLE
        if (this.left.isNotEmpty()) {
            const leftCopy = this.left.copy().pourOut(),
                rightCopy = this.right.copy()
            if (this.isNotSameAsBaseCondition(leftCopy, rightCopy))
                this.children.push(new Node(leftCopy, rightCopy))
        }
        // POUR OVER FROM LEFT TO RIGHT BOTTLE
        if (this.left.isNotEmpty() && this.right.hasRoom()) {
            const leftCopy = this.left.copy(),
                rightCopy = this.right.copy()
            leftCopy.pourOverTo(rightCopy)
            if (this.isNotSameAsBaseCondition(leftCopy, rightCopy))
                this.children.push(new Node(leftCopy, rightCopy))
        }
        // FILL UP RIGHT BOTTLE
        if (this.right.hasRoom()) {
            const leftCopy = this.left.copy(),
                rightCopy = this.right.copy().fillUp()
            if (this.isNotSameAsBaseCondition(leftCopy, rightCopy))
                this.children.push(new Node(leftCopy, rightCopy))
        }
        // POUR OUT RIGHT BOTTLE
        if (this.right.isNotEmpty()) {
            const leftCopy = this.left.copy(),
                rightCopy = this.right.copy().pourOut()
            if (this.isNotSameAsBaseCondition(leftCopy, rightCopy))
                this.children.push(new Node(leftCopy, rightCopy))
        }
        // POUR OVER FROM RIGHT TO LEFT BOTTLE
        if (this.right.isNotEmpty() && this.left.hasRoom()) {
            const leftCopy = this.left.copy(),
                rightCopy = this.right.copy()
            rightCopy.pourOverTo(leftCopy)
            if (this.isNotSameAsBaseCondition(leftCopy, rightCopy))
                this.children.push(new Node(leftCopy, rightCopy))
        }
    }

    isNotSameAsBaseCondition(left, right) {
        return left.content == 0 && right.content == 0
    }
}

export class Tree {
    constructor(leftBottle, rightBottle) {
        this.node = new Node(leftBottle, rightBottle)
        this.root = this.node
    }

    traverseDepthFirst(callback) {

        function recurse(currentNode) {
            for (const child in currentNode.children) {
                recurse(child)
            }
            callback(currentNode)
        }

        recurse(this.root)
    }

    traverseBreadthFirst(callback) {
        const queue = Array()
        queue.push(this.root)

        let currentNode = queue.unshift()

        while (currentNode) {
            for (const child in currentNode.children) {
                queue.push(child)
            }

            callback(currentNode)
            currentNode = queue.unshift()
        }
    }
}

export const sanityCheck = () => 'Test is working!'