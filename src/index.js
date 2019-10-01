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

    add(some) { // For test only
        this.content += some
        return this
    }

    take(some) { // For test only
        this.content -= some
        return this
    }
}

function log(message) {
    console.log(message)
}

function main() {
    const volume3 = 3, volume5 = 5

    const b3 = new Bottle(volume3)
    const b5 = new Bottle(volume5)

    let target = 1
}





main()
const sanityCheck = () => 'Test is working!'
export default sanityCheck