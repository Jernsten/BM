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


function main() {
    const volume3 = 3, volume5 = 5

    const first3l = new Bottle(volume3)
    const second5l = new Bottle(volume5)

    const rootNode = new Node(first3l, second5l, 0)
}

class Node {
    constructor(first, second, counter) {
        this.first = first
        this.second = second
        this.stepCounter = counter
        this.meetsBaseRequirements = this.checkRequirements()

        // Om vi hittat 1 eller 4 i falska ett eller två
        // skriva ut det någonstans

        if (this.meetsBaseRequirements) {
            this.createNextLevelNodes()
        }
    }

    createNextLevelNodes() {
        // kan jag fylla första flaskan?
        if (this.first.hasRoomFor() > 0) { // A
            this.first.fillUp()
            this.stepCounter++
            log("Fill first, volym first = " + this.first.content + " second = " + this.second.content)
            new Node(this.first, this.second, this.stepCounter)

        } else if (this.first.content > 0 && this.second.hasRoomFor() > 0) { // B
            this.first.pourOverTo(this.second)
            this.stepCounter++
            log("Pour to second, volym first = " + this.first.content + " second = " + this.second.content)
            new Node(this.first, this.second, this.stepCounter)

        } else if (this.first.content > 0) { // C
            this.first.pourOut()
            this.stepCounter++
            log("Pour first, volym first = " + this.first.content + " second = " + this.second.content)
            new Node(this.first, this.second, this.stepCounter)
        } else if (this.second.hasRoomFor() > 0) {
            
        }
    }

    checkRequirements() {
        if (this.stepCounter > 0 && this.first.isEmpty() && this.second.isEmpty())
            return false
        else if (this.stepCounter > 0 && this.first.isFull() && this.second.isFull())
            return false
        else
            return true
    }
}



main()
const sanityCheck = () => 'Test is working!'
export default sanityCheck
function log(message) {
    console.log(message)
}