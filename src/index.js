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
            const left = this.left.fillUp()
            this.pushChildNode(left, this.right)
        }
        if (this.left.content > 0) { // B
            const left = this.left.pourOut()
            this.pushChildNode(left, this.right)
        }
        if (this.left.content > 0 && this.right.hasRoomFor() > 0) { // C
            const left = this.left, right = this.right
            left.pourOverTo(right)
            this.pushChildNode(left, right)
        }
        if (this.right.hasRoomFor() > 0) { // D
            const right = this.right.fillUp()
            this.pushChildNode(this.left, right)
        }
        if (this.right.content > 0) { // E
            const right = this.right.pourOut()
            this.pushChildNode(this.left, right)
        }
        if (this.right.content > 0 && this.right.hasRoomFor() > 0) { // F
            const left = this.left, right = this.right
            right.pourOverTo(left)
            this.pushChildNode(left, right)
        }
    }

    pushChildNode(right, left) {
        if (right.isEmpty() && left.isEmpty())
            return // same as starting point, dont push
        else
            this.child.push(new Node(left, right))
    }
}



const sanityCheck = () => 'Test is working!'
export default sanityCheck
function log(message) {
    console.log(message)
}