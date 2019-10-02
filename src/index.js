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

    copy(){
        return new Bottle(this.volume).add(this.content)
    }
}

export class Node {
    constructor(leftBottle, rightBottle){
        this.left = leftBottle
        this.right = rightBottle
    }
}

export class Tree {
    constructor(rootNode){
        this.rootNode = rootNode
        this.branch = Object()
    }
}

const sanityCheck = () => 'Test is working!'
export default sanityCheck
function log(message) {
    console.log(message)
}