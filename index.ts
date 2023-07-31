import fs from 'fs'
import { colors } from './themes'

import { Flipbook } from './flipbook'
import chalk from 'chalk'


const getTitle = () => {
    return fs.readFileSync("assets/title.txt").toString()
}

const getCar = () => {
    return fs.readFileSync("assets/car.txt").toString()
}


const getRocket = () => {
    return fs.readFileSync("assets/rocket.txt").toString()
}

const main = () => {

    const title = getTitle();
    const car = getCar();
    const rocket = getRocket();

    const flipbook = new Flipbook({ fps: 30 });

    flipbook
        .place(title, {
            horizontal: 'center',
            vertical: 'top',
            color: 'magenta'
        })
        .place("National", { x: 10, y: 10, color: "red" })
        .place("National", { x: 10, y: 50, color: "red" })
        .placeAnimated(car, {
            color: 'green',
            from: {
                vertical: 'bottom',
                horizontal: 'left',
            },
            to: {
                vertical: 'bottom',
                horizontal: 'right',
            },
        })
        .placeAnimated(rocket, {
            color: 'cyan',
            from: {
                horizontal: 'right',
                vertical: 'bottom',
            },
            to: {
                vertical: 'top',
                horizontal: 'right',
            },
        })
        .render()
}

main()
