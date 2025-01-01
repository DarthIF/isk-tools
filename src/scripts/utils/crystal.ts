import { Rarity } from './rarity'


export const REFINED_TO_ORE: number = 20 * 50
export const CRYSTAL_TO_ORE: number = 20


export enum Crystal {
    CRYSTAL_ORE_RED = 'crystal_ore.red',
    CRYSTAL_ORE_BLUE = 'crystal_ore.blue',
    CRYSTAL_ORE_YELLOW = 'crystal_ore.yellow',

    CRYSTAL_RED = 'crystal.red',
    CRYSTAL_BLUE = 'crystal.blue',
    CRYSTAL_YELLOW = 'crystal.yellow',

    REFINED_CRYSTAL_RED = 'refined_crystal.red',
    REFINED_CRYSTAL_BLUE = 'refined_crystal.blue',
    REFINED_CRYSTAL_YELLOW = 'refined_crystal.yellow',
}

export function getCrystalColor(crystal: Crystal): string {
    switch (crystal) {
        case Crystal.CRYSTAL_ORE_RED:
        case Crystal.CRYSTAL_RED:
        case Crystal.REFINED_CRYSTAL_RED:
            return 'rgb(233, 30, 99)' // Pink 500
        case Crystal.CRYSTAL_ORE_BLUE:
        case Crystal.CRYSTAL_BLUE:
        case Crystal.REFINED_CRYSTAL_BLUE:
            return 'rgb(3, 169, 244)' // Light blue 500
        case Crystal.CRYSTAL_ORE_YELLOW:
        case Crystal.CRYSTAL_YELLOW:
        case Crystal.REFINED_CRYSTAL_YELLOW:
            return 'rgb(255, 235, 59)' // Yellow 500
        default:
            return 'rgb(255, 255, 255)' // White
    }
}

export function getCrystalRarity(crystal: Crystal): Rarity {
    switch (crystal) {
        case Crystal.CRYSTAL_ORE_RED:
        case Crystal.CRYSTAL_ORE_BLUE:
        case Crystal.CRYSTAL_ORE_YELLOW:
            return Rarity.SR
        case Crystal.CRYSTAL_RED:
        case Crystal.CRYSTAL_BLUE:
        case Crystal.CRYSTAL_YELLOW:
            return Rarity.SSR
        case Crystal.REFINED_CRYSTAL_RED:
        case Crystal.REFINED_CRYSTAL_BLUE:
        case Crystal.REFINED_CRYSTAL_YELLOW:
            return Rarity.UR
    }
}

export function getCrystalImageURL(crystal: Crystal): string {
    switch (crystal) {
        case Crystal.CRYSTAL_ORE_RED:
        case Crystal.CRYSTAL_RED:
        case Crystal.REFINED_CRYSTAL_RED:
            return '/static/images/vermelho-removebg-preview.png'
        case Crystal.CRYSTAL_ORE_BLUE:
        case Crystal.CRYSTAL_BLUE:
        case Crystal.REFINED_CRYSTAL_BLUE:
            return '/static/images/azul-removebg-preview.png'
        case Crystal.CRYSTAL_ORE_YELLOW:
        case Crystal.CRYSTAL_YELLOW:
        case Crystal.REFINED_CRYSTAL_YELLOW:
            return '/static/images/amarelo-removebg-preview.png'
        default:
            return ''
    }
}



