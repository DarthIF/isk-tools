export const APP_NAME: string = 'ISK TOOLS'
export const APP_DESCIPTION: string = 'Tools for the game Isekai:Slow Life'


export function getDepthLevel(): number {
    // @ts-ignore
    if (!window.ISK_COMPAT)
        return 0

    // @ts-ignore
    return window.ISK_COMPAT.DEPTH_LEVEL
}

export function xref(href: string) {
    const result = [href]
    const depth = getDepthLevel()

    for (let i = 0; i < depth; i++) {
        result.unshift('..')
    }

    return result.join('/')
}

