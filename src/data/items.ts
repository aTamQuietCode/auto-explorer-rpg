import type { Item } from "../types/game";

export const ITEMS: Record<string, Item> = {
    "herb": { 
        id: "herb", 
        name: "薬草", 
        description: "香りの良い草。次の探索時間を10%短縮する。", 
        rarity: "Common", 
        sellPrice: 10,
        effect: { type: "SPEED_BOOST", value: 0.9 }
    },
    "stone": { 
        id: "stone", 
        name: "丸い石", 
        description: "ただの石ころ。", 
        rarity: "Common", 
        sellPrice: 5,
    },
    "crystal": { 
        id: "crystal", 
        name: "魔導結晶", 
        description: "淡く光る石。", 
        rarity: "Rare", 
        sellPrice: 500 ,
        effect: { type: "", value: 0 }
    },
};