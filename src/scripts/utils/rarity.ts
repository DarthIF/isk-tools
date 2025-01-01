export enum Rarity {
    SR, SSR, UR
}

export function getRarityColor(rarity: Rarity): RarityColor {
    // https://materialui.co/colors

    switch (rarity) {
        case Rarity.SR:
            return new RarityColor('rgba(171, 71, 188, 1)', 'rgba(74, 20, 140, 1)') // Purple 400, Purple 900
        case Rarity.SSR:
            return new RarityColor('rgba(255, 238, 88, 1)', 'rgba(249, 168, 37, 1)') // Yellow 400, Yellow 800
        case Rarity.UR:
            return new RarityColor('rgba(255, 167, 38, 1)', 'rgba(230, 81, 0, 1)') // Orange 400, Orange 900
        default:
            return new RarityColor('rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)') // White, Black
    }
}

export class RarityColor {
    public light: string
    public dark: string

    constructor(light: string, dark: string) {
        this.light = light
        this.dark = dark
    }

}