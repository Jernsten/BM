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
        const canFit = otherBottle.hasRoomFor()

        if (canFit == 0 || canPour == 0) return // cant fit anymore or nothing to pour over

        const amountToPour = canFit <= canPour ? canFit : canPour
        otherBottle.content += amountToPour
        this.content -= amountToPour
    }

    hasRoomFor() {
        return this.volume - this.content
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

    contains(callback, traversal) {
        traversal.call(this, callback)
    }

    add(leftBottle, rightBottle, toNode, traversal) {
        const child = new Node(leftBottle, rightBottle) // add this child
        let parent = null                               // with this parent

        const callback = node => {
            if (node.left.content == toNode ||
                node.right.content == toNode)   // logic to find the parent to attach to
                parent = node
        }
        this.contains(callback, traversal)

        if (parent) {
            parent.children.push(child)
            child.parent = parent
        } else
            throw new Error('Parent doesnt exist, cant add node')
    }
}

const sanityCheck = () => 'Test is working!'
export default sanityCheck
function log(message) {
    console.log(message)
}