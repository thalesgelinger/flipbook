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

    const marginTexts = 3

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
        .place("mobile C2 / i use vim btw", {
            horizontal: 'center',
            x: ({ centerX }) => centerX + Math.floor(title.split("\n").length / 2) + 1,
            color: 'cyan',
        })
        .placeAnimated(`Skills:
- The best one to try the 
  hard things first
- Good detective
- Fail fast, learn fast, 
  improve fast
- The best pair for your 
  pair programming
         `, {
            color: 'cyan',
            from: {
                hide: true,
            },
            to: {
                x: 3,
                y: marginTexts,
                hide: false,
            }
        })
        .placeAnimated(`Goals:
- Become a tech lead
- Make EMA the BLAZILING FAST 
  react native app
- Make typescript stronger
- Test every single piece of code
- Squat with at least 100kg
- Spread the vim's word around 
  the company
         `, {
            color: 'cyan',
            from: {
                hide: true,
            },
            to: {
                x: 3,
                y: 30 + marginTexts,
                hide: false,
            }
        })

        .placeAnimated(`About me:
_ I like to code FOR REAL
- Building many flavors of pokedex 
- Building mechanical keyboards 
  from scratch
- Living in the beach with my 
  wife and 2 dogs.
         `, {
            color: 'cyan',
            from: {
                hide: true,
            },
            to: {
                x: 3,
                y: 70 + marginTexts,
                hide: false,
            }
        })
        .placeAnimated(national, {
            color: 'green',
            from: {
                hide: true,
            },
            to: {
                y: 5,
                x: 28,
                hide: false,
            }
        })
        .placeAnimated(enterprise, {
            color: 'green',
            from: {
                hide: true,
            },
            to: {
                y: 10,
                x: 28 + getAnchors(national).height,
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
