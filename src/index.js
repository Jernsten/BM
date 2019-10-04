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
        if (leftBottle != undefined && rightBottle != undefined)
            console.log("left: " + leftBottle.content + "| right: " + rightBottle.content)
        this.left = leftBottle
        this.right = rightBottle
        this.parent = null
        this.children = []
    }

    generateChildren() {
        // FILL UP LEFT BOTTLE
        if (this.left.hasRoom()) {
            const leftCopy = this.left.copy().fillUp(),
                rightCopy = this.right.copy()
            this.addIfNotTwoEmptyBottles(leftCopy, rightCopy)
        }
        // POUR OUT LEFT BOTTLE
        if (this.left.isNotEmpty()) {
            const leftCopy = this.left.copy().pourOut(),
                rightCopy = this.right.copy()
            this.addIfNotTwoEmptyBottles(leftCopy, rightCopy)
        }
        // POUR OVER FROM LEFT TO RIGHT BOTTLE
        if (this.left.isNotEmpty() && this.right.hasRoom()) {
            const leftCopy = this.left.copy(),
                rightCopy = this.right.copy()
            leftCopy.pourOverTo(rightCopy)
            this.addIfNotTwoEmptyBottles(leftCopy, rightCopy)
        }
        // FILL UP RIGHT BOTTLE
        if (this.right.hasRoom()) {
            const leftCopy = this.left.copy(),
                rightCopy = this.right.copy().fillUp()
            this.addIfNotTwoEmptyBottles(leftCopy, rightCopy)
        }
        // POUR OUT RIGHT BOTTLE
        if (this.right.isNotEmpty()) {
            const leftCopy = this.left.copy(),
                rightCopy = this.right.copy().pourOut()
            this.addIfNotTwoEmptyBottles(leftCopy, rightCopy)
        }
        // POUR OVER FROM RIGHT TO LEFT BOTTLE
        if (this.right.isNotEmpty() && this.left.hasRoom()) {
            const leftCopy = this.left.copy(),
                rightCopy = this.right.copy()
            rightCopy.pourOverTo(leftCopy)
            this.addIfNotTwoEmptyBottles(leftCopy, rightCopy)
        }
    }

    addIfNotTwoEmptyBottles(left, right) {
        if (!(left.content == 0 && right.content == 0)) {
            const child = new Node(left, right)
            child.parent = this
            this.children.push(child)
        }
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

    traverseBreadthFirst(logic) {
        const queue = [this.root]               // create queue with root node
        let currentNode = queue.shift()         // dequeue root node

        while (currentNode) {   // while node exists
            console.log('LOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOPING')
            console.log(currentNode)

            // for (const child in currentNode.children) {
            //     console.log('child to add: ' + child)
            //     queue.push(child)                   // queque children
            // }

            currentNode.children.forEach(child=>{
                console.log('child to add: ' + child)
                queue.push(child)
            })

            logic(currentNode)                      // do smthn with current node
            console.log("queue length: " + queue.length)
            currentNode = queue.shift()             // take next node
            console.log("queue length: " + queue.length)

        }
    }

    grow() {
        this.node.generateChildren()
        return this
    }

    contains(logic) {
        return this.traverseBreadthFirst(logic)
    }
}

export const sanityCheck = () => 'Test is working!'