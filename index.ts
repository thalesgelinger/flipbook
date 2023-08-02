import fs from 'fs'
import { Flipbook } from './flipbook'
import { getAnchors } from './anchors'


const getAsset = (key: string) => {
    return fs.readFileSync(`assets/${key}.txt`).toString()
}


const main = () => {

    const car = getAsset("car")
    const title = getAsset("title")
    const rocket = getAsset("rocket")
    const national = getAsset("national")
    const enterprise = getAsset("enterprise")

    const flipbook = new Flipbook({ fps: 29 });

    flipbook
        .place(title, {
            horizontal: 'center',
            vertical: 'center',
            color: 'cyan',
        })
        .place("The nerdola / The typescript wizard ", {
            horizontal: 'center',
            x: ({ centerX }) => centerX + Math.floor(title.split("\n").length / 2),
            color: 'cyan',
        })
        .place("i use vim btw", {
            horizontal: 'center',
            x: ({ centerX }) => centerX + Math.floor(title.split("\n").length / 2) + 1,
            color: 'cyan',
        })
        //         .placeAnimated(`I use vim btw
        // i write some shit code that sometime is good
        // Fail Fast, learn fast, Improve fast.
        // It's not my fault that things are complex
        // `, {
        //             from: {
        //                 horizontal: 'left',
        //                 vertical: 'top',
        //                 hide: true,
        //             },
        //             to: {
        //                 horizontal: 'left',
        //                 vertical: 'top',
        //                 hide: false,
        //             }
        //         })
        .placeAnimated(national, {
            color: 'green',
            from: {
                y: 0,
                x: 40,
                hide: true,
            },
            to: {
                y: 10,
                x: 40,
                hide: false,
            }
        })
        .placeAnimated(enterprise, {
            color: 'green',
            from: {
                y: getAnchors(national).centerY ,
                x: 40 + getAnchors(national).height ,
                hide: true,
            },
            to: {
                y: getAnchors(national).centerY ,
                x: 40 + getAnchors(national).height ,
                hide: false,
            }
        })
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
            color: 'yellow',
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
