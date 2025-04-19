export enum Lang {
    PT, EN
}

export function getTranslation(lang: Lang, key: string): string {
    switch (lang) {
        case Lang.PT:
            return pt[key] || key
        case Lang.EN:
            return en[key] || key
        default:
            return key
    }
}

type Translations = {
    [key: string]: string;
};

const en: Translations = {
    'app.title': 'Isekai Slow Life - Crystal Collector',
    'app.header': 'Which crystals do you need?',
    'app.days': 'How many days will it take to get, just by buying?',
    'app.information': 'Ores that can be bought per day:',

    'crystal_ore.red': 'Bravery Crystal Ore',
    'crystal_ore.blue': 'Wisdom Crystal Ore',
    'crystal_ore.yellow': 'Hope Crystal Ore',

    'crystal.red': 'Bravery Crystal',
    'crystal.blue': 'Wisdom Crystal',
    'crystal.yellow': 'Hope Crystal',

    'refined_crystal.red': 'Refined Bravery Crystal',
    'refined_crystal.blue': 'Refined Wisdom Crystal',
    'refined_crystal.yellow': 'Refined Hope Crystal',

    'trading_post': 'Trading Post',
    'challenge_shop': 'Challenge Shop',
    'golemore_mine': 'Golemore Mine',
    'guild': 'Guild',
    'banquet': 'Banquet',
};

const pt: Translations = {
    'app.title': 'Isekai Slow Life - Crystal Collector',
    'app.header': 'Quais cristais você precisa?',
    'app.days': 'Quantos dias você vai levar para conseguir, apenas comprando?',
    'app.information': 'Minérios que poderão ser comprados por dia:',

    'crystal_ore.red': 'Minério de Cristal de Bravura',
    'crystal_ore.blue': 'Minério de Cristal de Sabedoria',
    'crystal_ore.yellow': 'Minério de Cristal de Esperança',

    'crystal.red': 'Cristal de Bravura',
    'crystal.blue': 'Cristal de Sabedoria',
    'crystal.yellow': 'Cristal de Esperança',

    'refined_crystal.red': 'Bravery Cristal',
    'refined_crystal.blue': 'Wisdom Cristal',
    'refined_crystal.yellow': 'Hope Cristal',

    'trading_post': 'Guilda dos Mercadores',
    'challenge_shop': 'Loja de Desafios',
    'golemore_mine': 'Mina de Golemore',
    'guild': 'Guilda',
    'banquet': 'Banquete',
};