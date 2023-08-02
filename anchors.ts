
export const getAnchors = (str: string) => {
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
