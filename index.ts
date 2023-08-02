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
- The best one to try the hard
  things first
- Good detective
- Fail Fast, learn fast, 
  Improve fast
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
- Test every single piece of code;
- Squat with at least 100kg
- Propagete the vim word thorough 
  all company
         `, {
            color: 'cyan',
            from: {
                hide: true,
            },
            to: {
                x: 3,
                y: 35 + marginTexts,
                hide: false,
            }
        })

        .placeAnimated(`About me:
- I like to code, like for REAL, 
  i'm all the time thinking about it, 
  and what will be 
  the next crazy stuff 
  i will tell guys about.
- Currently, i'm building a pokedex in a 
  lot of different mobile techs
- I build mechanical keyboards from scratch,
  starting from solding the PCB components.
- I'm marriaged, i have 2 little dogs called 
  Lazy and Coffee.
         `, {
            color: 'cyan',
            from: {
                hide: true,
            },
            to: {
                x: 3,
                y: 75 + marginTexts,
                hide: false,
            }
        })
        .placeAnimated(national, {
            color: 'green',
            from: {
                y: 0,
                x: 30,
                hide: true,
            },
            to: {
                y: 10,
                x: 30,
                hide: false,
            }
        })
        .placeAnimated(enterprise, {
            color: 'green',
            from: {
                y: getAnchors(national).centerY,
                x: 30 + getAnchors(national).height,
                hide: true,
            },
            to: {
                y: getAnchors(national).centerY,
                x: 30 + getAnchors(national).height,
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
