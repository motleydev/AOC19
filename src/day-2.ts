import fs = require('fs')

const data: Array<number> = fs
    // .readFileSync('./data/day2.txt', 'utf-8')
    .readFileSync('./data/day2p2.txt', 'utf-8')
    .split(/,/)
    .map(Number);

// const data = [1,1,1,4,99,5,6,0,99]

// let dest = [...data]

const programs: Array<[number, number, number, number]> = []




// while (programEnd < data.length) {
//     let slice = dest.slice(programStart,programEnd+1)
//     if (slice[0] === 99) {
//       console.log(dest[0])
//       break
//     }
//     operator(slice)
//     programStart+=4
//     programEnd+=4
// }

let addr1 = 0

while (addr1 < 100) {

  let addr2 = 0
  while (addr2 < 100) {


    let programStart = 0
    let programEnd = 3
    let dest = [...data]

    const add = (arr: Array<number>) => dest[arr[1]] + dest[arr[2]]
    const multiply = (arr: Array<number>) => dest[arr[1]] * dest[arr[2]]

const operator = (arr: Array<number>) => {
    switch(arr[0]) {
        case 1:
          dest[arr[3]] = add(arr)
          break;
        case 2:
          dest[arr[3]] = multiply(arr)
          break;
        default:
          break
      }
}

    dest[1] = addr1
    dest[2] = addr2
    while (programEnd < data.length) {
      let slice = dest.slice(programStart,programEnd+1)
      if (slice[0] === 99) {
        if (dest[0] === 19690720) {
          console.log(addr1, addr2)
        }
        break
      }
      operator(slice)
      programStart+=4
      programEnd+=4
  }


    addr2++
  }

  addr1++
}

// programs.map(operator)

// console.log(dest)
