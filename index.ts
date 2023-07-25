import fs from 'fs'
import { Flipbook } from './flipbook'

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

    const flipbook = new Flipbook({ fps: 10 });

    flipbook
        .place(title, {
            x: 1,
            horizontal: 'center',
            vertical: 'top',
            color: 'white'
        })
        .place("National", { x: 10, y: 10, color: "red" })
        .place("National", { x: 10, y: 40, color: "blue" })
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
                vertical: 'bottom',
                horizontal: 'right',
            },
            to: {
                vertical: 'top',
                horizontal: 'right',
            },
        })
        .render()
}

main()
