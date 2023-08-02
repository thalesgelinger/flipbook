import { getAnchors } from "./anchors"
import { colors } from "./themes"
import { backgroundColors } from "./themes/colors"

type Component = {
    item: string,
    style: {
        x?: number,
        y?: number,
    }
}

type AnimatedComponent = {
    item: string,
    animation: Animation
}
const dimensions = {
    width: process.stdout.columns,
    heigth: process.stdout.rows,
    centerX: Math.floor(process.stdout.rows / 2),
    centerY: Math.floor(process.stdout.columns / 2),
}

type Dimensions = typeof dimensions;

type Position = {
    x?: number | ((dimensions: Dimensions) => number),
    y?: number | ((dimensions: Dimensions) => number),
    horizontal?: 'left' | 'center' | 'right',
    vertical?: 'top' | 'center' | 'bottom'
}

type PositionRaw = {
    x?: number;
    y?: number;
    horizontal?: 'left' | 'center' | 'right',
    vertical?: 'top' | 'center' | 'bottom',
    hide?: boolean,

}

type Animation = {
    color?: keyof typeof colors
    backgroundColor?: keyof typeof backgroundColors
    from: PositionRaw,
    to: PositionRaw,
}

type Style = {
    color?: keyof typeof colors
    backgroundColor?: keyof typeof backgroundColors
} & Partial<Position>




const delay = (time = 1000) => new Promise(r => setTimeout(r, time))

export class Flipbook {

    #page: string[][] = [];
    #FPS: number = 0;
    #fpsClockCounter: number = 0;
    #animatedComponents: AnimatedComponent[] = [];
    #components: Component[] = [];

    constructor({ fps }: { fps: number }) {
        this.#FPS = fps;
        this.#cleanCanva()
        this.#fpsClockCounter = 0;
    }

    #cleanCanva() {
        this.#page = []
        for (let i = 0; i < process.stdout.rows; i++) {
            this.#page.push([...Array(process.stdout.columns)].map(_ => " "))
        }
    }


    #handlePositionValue(value?: number | ((dimensions: Dimensions) => number)): number {
        if (value) {
            switch (typeof value) {
                case "number":
                    return value
                case "function":
                    return value(dimensions)
            }
        }
        return 0
    }

    #calculatePosition(item: string, style: Style): { x: number, y: number } {
        let x = this.#handlePositionValue(style.x);
        let y = this.#handlePositionValue(style.y);


        const anchors = getAnchors(item)

        const itemLine = item.split("\n")[0]
        const unicodeSize = itemLine.length - this.#getVisibleLength(itemLine);

        if (!!style?.horizontal) {
            switch (style.horizontal) {
                case 'center':
                    y = dimensions.centerY - anchors.centerY
                    break;
                case 'left':
                    y = 1
                    break;
                case 'right':
                    y = dimensions.width - anchors.width + unicodeSize -1
                    break;
            }
        }

        if (!!style?.vertical) {
            switch (style.vertical) {
                case 'center':
                    x = dimensions.centerX - anchors.centerX
                    break;
                case 'top':
                    x = 1
                    break;
                case 'bottom':
                    x = dimensions.heigth - anchors.height 
                    break;
            }
        }

        return { x, y };
    }

    place(item: string, style: Style) {
        const styledItem = item.split("\n").map(rawLine => {
            let line = rawLine;
            if (style?.color) {
                line = colors[style.color] + line + colors.reset
            }
            if (style?.backgroundColor) {
                line = backgroundColors[style.backgroundColor] + line;
            }
            return line
        }).join("\n")

        const { x, y } = this.#calculatePosition(styledItem, style);

        this.#components.push({ item: styledItem, style: { ...style, x, y } })
        return this
    }

    placeAnimated(item: string, animation: Animation) {

        const styledItem = item.split("\n").map(rawLine => {
            let line = rawLine;
            if (animation?.color) {
                line = colors[animation.color] + line + colors.reset
            }
            if (animation?.backgroundColor) {
                line = backgroundColors[animation.backgroundColor] + line;
            }
            return line
        }).join("\n")

        this.#animatedComponents.push({ item: styledItem, animation })
        return this
    }


    #getVisibleLength(str: string) {
        return str.replace(/\u001b\[\d{1,2}m/g, "").length;
    }


    #addToLine({ line, column, text }: { line: string[], column: number, text: string }) {
        const lineHiddenText = line.length - this.#getVisibleLength(line.join(""));
        const visibleLength = this.#getVisibleLength(text);
        const space = text.length - visibleLength
        const lineLength = line.length
        line[column + lineHiddenText] = text
        line = line.join("").split("")
        line.length = lineLength + space
        return line;
    }

    #placeComponents() {
        this.#components.forEach(component => {
            const { item, style: { x, y } } = component
            const strLines = item.split('\n')

            for (let i = 0; i < strLines.length; i++) {
                this.#page[x! + i] = this.#addToLine({
                    line: this.#page[x! + i],
                    column: y!,
                    text: strLines[i]
                })
            }
            return this;
        })
    }

    #fromToSteps(from: number, to: number): number {
        return Math.ceil(Math.abs(from > to ? to - from : from - to) / this.#FPS)
    }


    #nextPosition(from: number, to: number, step: number): number {
        const direction = from > to ? -1 : 1;
        const nextStep = from + (this.#fpsClockCounter * step * direction)

        if (nextStep < 1) {
            return 1;
        }

        if (direction > 0 && nextStep > to) {
            return to
        }


        return nextStep;
    }

    #placeAnimatedComponents() {
        this.#animatedComponents.forEach(({ item, animation }) => {
            if (!!animation.from.hide && this.#fpsClockCounter < this.#FPS) {
                return;
            }

            if (!!animation.to.hide && this.#fpsClockCounter < this.#FPS) {
                return;
            }

            const from = this.#calculatePosition(item, animation.from);
            const to = this.#calculatePosition(item, animation.to)

            const xStep = this.#fromToSteps(from.x, to.x);
            const yStep = this.#fromToSteps(from.y, to.y);


            const x = this.#nextPosition(from.x, to.x, xStep);
            const y = this.#nextPosition(from.y, to.y, yStep);


            const strLines = item.split('\n')

            for (let i = 0; i < strLines.length; i++) {
                this.#page[x! + i] = this.#addToLine({
                    line: this.#page[x! + i],
                    column: y!,
                    text: strLines[i]
                })
            }
            return this;
        })
    }

    render() {
        const move = async () => {
            this.#cleanCanva()

            this.#fpsClockCounter++;

            if (this.#fpsClockCounter > this.#FPS) {
                await delay(5000);
                this.#fpsClockCounter = 0;
            }

            this.#placeComponents();
            this.#placeAnimatedComponents();

            process.stdout.write('\x1B[2J\x1B[H');
            for (let i = 0; i < this.#page.length; i++) {
                process.stdout.write(this.#page[i].join('') + "\n")
            }
            this.render()

        }

        setTimeout(move, 1000 / this.#FPS)
    }

}

