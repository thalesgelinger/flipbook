import fs from 'fs'
import { Flipbook } from './flipbook.js'

const colors = {
    white: '\x1b[37m',
    green: '\x1b[32m'
}

const getTitle = () => {
    const title = fs.readFileSync("assets/title.txt").toString()
    return colors.white + title
}

const getCar = () => {
    return colors.green + fs.readFileSync("assets/car.txt").toString()
}


const anchors = (str) => {
    const splittedStr = str.split('\n')
    const strH = splittedStr.length
    const strW = splittedStr[0].length

    return {
        centerX: Math.floor(strH / 2),
        centerY: Math.floor(strW / 2),
        height: strH,
        width: strW
    }
}

const main = () => {


    const dimensions = {
        width: process.stdout.columns,
        heigth: process.stdout.rows,
        centerX: process.stdout.columns / 2,
        centerY: process.stdout.rows / 2,
    }

    const title = getTitle();
    const car = getCar();

    const flipbook = new Flipbook({ fps: 25 });

    flipbook
        .place(title, { x: 1, y: dimensions.width / 2 - anchors(title).centerY })
        .place("National", { x: 10, y: 10 })
        .place(`I want to`, { x: 11, y: 10 })
        .placeAnimated(car, {
            from: {
                x: dimensions.heigth - anchors(car).height,
                y: 0
            },
            to: {
                x: dimensions.heigth - anchors(car).height,
                y: 50
            },
        })
        .render()
}

main()

