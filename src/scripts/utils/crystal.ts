import { Rarity } from './rarity'
import { Item } from './item'


export const REFINED_TO_ORE: number = 20 * 50
export const CRYSTAL_TO_ORE: number = 20

const color_red = 'rgb(233, 30, 99)'
const color_blue = 'rgb(3, 169, 244)'
const color_yellow = 'rgb(255, 235, 59)'

const image_red = 'static/images/vermelho-removebg-preview.png'
const image_blue = 'static/images/azul-removebg-preview.png'
const image_yellow = 'static/images/amarelo-removebg-preview.png'


export const Crystals = {
    CRYSTAL_ORE_RED: new Item('crystal_ore.red', Rarity.SR, image_red, color_red),
    CRYSTAL_ORE_BLUE: new Item('crystal_ore.blue', Rarity.SR, image_blue, color_blue),
    CRYSTAL_ORE_YELLOW: new Item('crystal_ore.yellow', Rarity.SR, image_yellow, color_yellow),

    CRYSTAL_RED: new Item('crystal.red', Rarity.SSR, image_red, color_red),
    CRYSTAL_BLUE: new Item('crystal.blue', Rarity.SSR, image_blue, color_blue),
    CRYSTAL_YELLOW: new Item('crystal.yellow', Rarity.SSR, image_yellow, color_yellow),

    REFINED_CRYSTAL_RED: new Item('refined_crystal.red', Rarity.UR, image_red, color_red),
    REFINED_CRYSTAL_BLUE: new Item('refined_crystal.blue', Rarity.UR, image_blue, color_blue),
    REFINED_CRYSTAL_YELLOW: new Item('refined_crystal.yellow', Rarity.UR, image_yellow, color_yellow),
}
