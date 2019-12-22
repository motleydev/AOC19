import fs = require('fs')

const data: Array<number> = fs
    .readFileSync('./data/day1.txt', 'utf-8')
    .split(/\n/)
    .map(Number);


const mTf = (input: number): number => Math.floor(input / 3) - 2

const recursiveMass = (
    input: number,
    collection: Array<number> = []): number => {

    if (mTf(input) > 0) {
        return recursiveMass(
            mTf(input),
            [...collection, mTf(input)]
        )
    }
    const result = collection.reduce(
        (collector, current) => {
            return collector + current
        }, 0)

    console.log(result)
    return result
}

const result: number = data.reduce((collection, current) => {
    return collection + recursiveMass(current) 
},0)

console.log(result)