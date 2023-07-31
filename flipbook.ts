import { colors } from "./themes"

type Component = {
    item: string,
    style: Style,
}

type AnimatedComponent = {
    item: string,
    animation: Animation
}

type Position = {
    x?: number,
    y?: number,
    horizontal?: 'left' | 'center' | 'right',
    vertical?: 'top' | 'center' | 'bottom'
}
type Animation = {
    color?: keyof typeof colors
    from: Position,
    to: Position,
}

type Style = {
    color?: keyof typeof colors
} & Partial<Position>



const dimensions = {
    width: process.stdout.columns,
    heigth: process.stdout.rows,
    centerX: Math.floor(process.stdout.rows / 2),
    centerY: Math.floor(process.stdout.columns / 2),
}

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

    #calculateAnchors(str: string) {
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

    #calculatePosition(item: string, style: Style) {
        let x = style?.x ?? 0;
        let y = style?.y ?? 0;

        const anchors = this.#calculateAnchors(item)

        if (!!style?.horizontal) {
            switch (style.horizontal) {
                case 'center':
                    y = dimensions.centerY - anchors.centerY
                    break;
                case 'left':
                    y = 0
                    break;
                case 'right':
                    y = dimensions.width - anchors.width
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
        const styledItem = item.split("\n").map(line => {
            // return line;
            return style?.color ? colors[style.color] + line + colors.reset : line;
        }).join("\n")

        const { x, y } = this.#calculatePosition(styledItem, style);

        this.#components.push({ item: styledItem, style: { ...style, x, y } })
        return this
    }

    placeAnimated(item: string, animation: Animation) {

        const styledItem = item.split("\n").map(line => {
            // return line;
            return animation?.color ? colors[animation.color] + line + colors.reset : line;
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

    #fromToSteps(from: number, to: number) {
        return Math.floor(Math.abs(from > to ? to - from : from - to) / this.#FPS)
    }

    #placeAnimatedComponents() {
        this.#animatedComponents.forEach(({ item, animation }) => {
            const from = this.#calculatePosition(item, animation.from);
            const to = this.#calculatePosition(item, animation.to)

            const { x: xStep, y: yStep } = {
                x: this.#fromToSteps(from.x, to.x),
                y: this.#fromToSteps(from.y, to.y),
            }

            const { x, y } = {
                x: from.x + (this.#fpsClockCounter * xStep * (from.x > to.x ? -1 : 1)),
                y: from.y + (this.#fpsClockCounter * yStep * (from.y > to.y ? -1 : 1)),
            }

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

            if (this.#fpsClockCounter === this.#FPS) {
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

