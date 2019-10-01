import { expect } from 'chai'
import sanityCheck from '../src/index'
import { Bottle } from '../src/index'

describe('SANITY CHECK', () => {
    it('Should work', () => {
        expect(sanityCheck()).to.equal('Test is working!')
    })
})

describe('BOTTLE CREATION AND METHODS', () => {
    it('Should create a bottle', () => {
        expect(new Bottle()).to.be.an.instanceOf(Bottle)
    })

    it('Should have a volume', () => {
        expect(new Bottle()).to.have.ownProperty('volume')
    })

    it('Should create a bottle with 3l volume', () => {
        const volume = 3
        expect(new Bottle(volume)).to.have.property('volume').that.equals(volume)
    })

    it('Should have 0l content in bottle', () => {
        const empty = 0
        expect(new Bottle()).to.have.property('content').that.equals(empty)
    })

    it('Should fill bottle to max', () => {
        const volume = 5
        expect(new Bottle(volume).fillUp()).to.have.property('content').that.equals(volume)
    })

    it('Should empty the bottle completely', () => {
        const volume = 5
        const bottle = new Bottle(volume).fillUp()
        expect(bottle.pourOut()).to.have.property('content').that.equals(0)
    })
})

describe('TRANSACTIONS', () => {
    it('Should transfer all content from one bottle to the other', () => {
        const volume = 5
        const fullBottle = new Bottle(volume).fillUp()
        const emptyBottle = new Bottle(volume)

        fullBottle.pourOverTo(emptyBottle)

        expect(fullBottle.content).to.equal(0)
        expect(emptyBottle.content).to.equal(volume)
    })

    it('Should transfer content until other bottle is full', () => {
        const volume = 4, full = 4, halfFull = 2
        const fullBottle = new Bottle(volume).fillUp()
        const halfFullBottle = new Bottle(volume).add(halfFull)

        fullBottle.pourOverTo(halfFullBottle)

        expect(fullBottle.content).to.equal(halfFull)
        expect(halfFullBottle.content).to.equal(full)
    })

    it('Should transfer till other bottle is full and keep whats left', () => {
        const volume = 5
        let some = 3, someMore = 4

        const aBottle = new Bottle(volume).add(some) // 3
        const anotherBottle = new Bottle(volume).add(someMore) // 4

        aBottle.pourOverTo(anotherBottle) // give 1 from aBottle to anotherBottle

        expect(aBottle.content).to.equal(--some) // take 1
        expect(anotherBottle.content).to.equal(++someMore) // give 1
    })

    it('Should not be able to transfer from empty bottle', () => {
        const volume = 5

        const emptyBottle = new Bottle(volume)
        const anotherEmptyBottle = new Bottle(volume)

        emptyBottle.pourOverTo(anotherEmptyBottle)

        expect(emptyBottle.content).to.equal(0)
        expect(anotherEmptyBottle.content).to.equal(0) // both were empty to begin with, nothing to transfer
    })

    it('Should empty one bottle to other, none of them are full', () => {
        const volume = 5
        let some = 1, someMore = 2

        const aBottle = new Bottle(volume).add(some) //1
        const otherBottle = new Bottle(volume).add(someMore) //2

        aBottle.pourOverTo(otherBottle)

        expect(aBottle.content).to.equal(--some) // take 1
        expect(otherBottle.content).to.equal(++someMore) // give 1
    })

    it('Should not be able to transfer to full bottle', () => {
        const volume = 5, some = 3

        const aBottle = new Bottle(volume).add(some) // 3
        const anotherBottle = new Bottle(volume).fillUp() // 5

        aBottle.pourOverTo(anotherBottle)

        expect(aBottle.content).to.equal(some) // 3
        expect(anotherBottle.content).to.equal(volume) // 5
    })
})