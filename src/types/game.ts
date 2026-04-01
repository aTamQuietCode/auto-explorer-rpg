export interface Item {
    id: string;
    name: string;
    description: string;
    rarity: 'Common' | 'Uncommon' | 'Rare';
    sellPrice: number;
    effect?: {
        type: string, 
        value: number
    };
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

export interface ExpeditionResult {
    areaName: string;
    gold: number;
    items: string[];
}

export interface GameState {
    gold: number;
    inventory: string[];
    activeExpedition: Expedition | null;
    lastResult: ExpeditionResult | null;
    nextExpeditionSpeedBoost: number;
    lastUpdate: number;         // Last updated time for idle reward calculation
    incomePerMinute: number;    // Automatic reward per minute
    upgradeLevel: number;       // reinforcement level
    sellItem: string;
    useItem: string;
    offlineStats?: {
        minutes: number;
        gold: number;
    } | null;
    buffs?: {
        speedBoost: number;   // 探索時間短縮
        goldBoost: number;    // ゴールド獲得アップ
        dropBoost: number;    // レア泥率アップ
    } | null;
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