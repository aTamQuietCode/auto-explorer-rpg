// data/weapons.ts
export interface Weapon {
    id: string;
    name: string;
    price: number;
    description: string;
    goldMultiplier: number; // 探索で手に入るゴールドが何倍になるか
}

export const WEAPONS: { [key: string]: Weapon } = {
    copper_sword: {
        id: "copper_sword",
        name: "銅の剣",
        price: 100,
        description: "錆びているが、素手よりはマシ。",
        goldMultiplier: 1.2, // ゴールド1.2倍
    },
    iron_axe: {
        id: "iron_axe",
        name: "鉄の斧",
        price: 500,
        description: "ずっしりと重い。魔物もイチコロ？",
        goldMultiplier: 2.0, // ゴールド2倍
    },
    hero_spear: {
        id: "hero_spear",
        name: "勇者の槍",
        price: 5000,
        description: "伝説の勇者が使ったとされる槍。",
        goldMultiplier: 5.0, // ゴールド5倍
    },
};