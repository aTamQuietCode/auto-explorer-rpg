import type { ExplorationArea } from "../types/game";

export const EXPLPRATION_AREAS: ExplorationArea[] = [
    {
        id: "forest-1",
        name: "はじまりの森",
        description: "初心者向けの静かな森。少しのゴールドが手に入る。",
        durationSec: 60, // 1分
        minGold: 50,
        maxGold: 100,
        requiredLevel: 0,
        drops: [
            { itemId: "herb", chance: 0.5 },  // 50%
            { itemId: "stone", chance: 0.3 }, // 30%
        ]
    },
    {
        id: "cave-1",
        name: "暗い洞窟",
        description: "少し危険だが、お宝が眠っているかもしれない。",
        durationSec: 300, // 5分
        minGold: 200,
        maxGold: 500,
        requiredLevel: 5,
        drops: [
            { itemId: "stone", chance: 0.4 },
            { itemId: "crystal", chance: 0.05 }, // 5% のレア
        ]
    }
];