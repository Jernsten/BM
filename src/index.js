"use strict"
export class Bottle {
    constructor(volume, name = "") {
        this.volume = volume
        this.content = 0
        this.name = name
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
}

export class Node {
    constructor(leftBottle, rightBottle) {
        this.left = leftBottle
        this.right = rightBottle
        this.child = Array()
        this.createChildNodes()
    }

    createChildNodes() {
        if (this.left.hasRoomFor() > 0) { // A
            this.child.push(new Node(this.left.fillUp(), this.right))
        }
        if (this.left.content > 0) { // B
            this.child.push(new Node(this.left.pourOut(), this.right))
        }
        if (this.left.content > 0 && this.right.hasRoomFor() > 0) { // C
            this.left.pourOverTo(this.right)
            this.child.push(new Node(this.left, this.right))
        }
        if (this.right.hasRoomFor() > 0) { // A
            this.child.push(new Node(this.left, this.right.fillUp()))
        }
        if (this.right.content > 0) { // B
            this.child.push(new Node(this.left, this.right.pourOut()))
        }
        if (this.right.content > 0 && this.right.hasRoomFor() > 0) { // C
            this.left.pourOverTo(this.right)
            this.child.push(new Node(this.left, this.right))
        }
    }
}



const sanityCheck = () => 'Test is working!'
export default sanityCheck
function log(message) {
    console.log(message)
}