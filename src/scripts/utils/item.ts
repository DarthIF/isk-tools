import { Rarity, RarityColor, getRarityColor } from './rarity'

export class Item {
    private name: string
    private rarity: Rarity
    private image: string


    constructor(name: string, rarity: Rarity, image: string, color: string) {
        this.name = name
        this.rarity = rarity
        this.image = image
    }

    public getName(): string {
        return this.name
    }

    public getRarity(): Rarity {
        return this.rarity
    }

    public getImage(): string {
        return this.image
    }



    public getRarityColor(): RarityColor {
        return getRarityColor(this.rarity)
    }

    public isShiny(): boolean {
        return this.rarity === Rarity.SSR || this.rarity === Rarity.UR
    }


}