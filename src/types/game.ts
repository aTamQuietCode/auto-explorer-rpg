export interface Item {
    id: string;
    name: string;
    description: string;
    rarity: 'Common' | 'Uncommon' | 'Rare';
    sellPrice: number;
}

export interface DropTable {
    itemId: string;
    chance: number; // 0.0 ~ 1.0 (例: 0.1 は 10%)
}

export interface Expedition {
    areaId: string;
    areaName: string;
    endTime: number;    // Scheduled end time(ms)
}

export interface GameState {
    gold: number;
    inventory: string[];
    activeExpedition: Expedition | null;
    lastUpdate: number;         // Last updated time for idle reward calculation
    incomePerMinute: number;    // Automatic reward per minute
    upgradeLevel: number;       // reinforcement level
}

export interface ExplorationArea {
    id: string;
    name: string;
    description: string;
    durationSec: number;
    minGold: number;
    maxGold: number;
    requiredLevel:number;
    drops: DropTable[];
}