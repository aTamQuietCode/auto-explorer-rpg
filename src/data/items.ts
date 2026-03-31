import type { Item } from "../types/game";

export const ITEMS: Record<string, Item> = {
    "herb": { id: "herb", name: "薬草", description: "苦い葉っぱ。", rarity: "Common", sellPrice: 10 },
    "stone": { id: "stone", name: "丸い石", description: "ただの石ころ。", rarity: "Common", sellPrice: 5 },
    "crystal": { id: "crystal", name: "魔導結晶", description: "淡く光る石。", rarity: "Rare", sellPrice: 500 },
};