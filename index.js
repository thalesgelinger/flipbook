import fs from 'fs'

const getTitle = () => {
    const title = fs.readFileSync("assets/title.txt").toString()
    return '\x1b[37m' + title
}

const getCar = () => {
    return '\x1b[32m' + fs.readFileSync("assets/car.txt").toString()
}


class Canva {

    #FPS = 30;
    #fpsClockCounter = 0;
    #animatedComponents = [];
    #components = [];

    constructor() {
        this.#cleanCanva()
        this.#fpsClockCounter = 0;
    }

    #cleanCanva() {
        this.canvas = []
        for (let i = 0; i < process.stdout.rows; i++) {
            this.canvas.push([...Array(process.stdout.columns)].map(_ => " "))
        }
    }

    place(str, position) {
        this.#components.push({ item: str, position })
        return this
    }

    placeAnimated(str, animation) {
        this.#animatedComponents.push({ item: str, animation })
        return this
    }

    #placeComponents() {
        this.#components.forEach(component => {
            const { item, position: { x, y } } = component
            const strLines = item.split('\n')

            for (let i = 0; i < strLines.length; i++) {
                for (let j = 0; j < strLines[i].length; j++) {
                    this.canvas[x + i][y + j] = strLines[i][j]
                }
            }
            return this;
        })
    }

    #placeAnimatedComponents() {
        this.#animatedComponents.forEach(({ item, animation }) => {
            const { from, to } = animation

            const { x: xStep, y: yStep } = {
                x: Math.abs(from.x > to.x ? to.x - from.x : from.x - to.x) / this.#FPS,
                y: Math.abs(from.y > to.y ? to.y - from.y : from.y - to.y) / this.#FPS,
            }

            const { x, y } = {
                x: from.x + this.#fpsClockCounter * xStep,
                y: from.y + this.#fpsClockCounter * yStep,
            }

            const strLines = item.split('\n')

            for (let i = 0; i < strLines.length; i++) {
                for (let j = 0; j < strLines[i].length; j++) {
                    this.canvas[x + i][y + j] = strLines[i][j]
                }
            }
            return this;
        })
    }

    render() {
        const move = () => {
            this.#cleanCanva()

            this.#fpsClockCounter++;

            if (this.#fpsClockCounter === this.#FPS) {
                this.#fpsClockCounter = 0;
            }

            this.#placeAnimatedComponents();
            this.#placeComponents();

            process.stdout.write('\x1B[2J\x1B[H');
            for (let i = 0; i < this.canvas.length; i++) {
                console.log(this.canvas[i].join(''))
            }
        }

        setInterval(move, 1000 / this.#FPS)
    }

}


const canva = new Canva();


canva
    .place(getTitle(), { x: 1, y: 0 })
    .placeAnimated(getCar(), {
        from: { x: 10, y: 0 },
        to: { x: 10, y: 60 },
    })
    .render()


