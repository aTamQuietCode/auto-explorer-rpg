export interface Monster {
    id: string;
    name: string;
    hp: number;
    attack: number;
    goldReward: number;
    image: string; // 絵文字でもOK 
}

export const MONSTERS: { [key: string]: Monster[] } = {
    "forest-1": [
        { id: "slime", name: "スライム", hp: 10, attack: 2, goldReward: 10, image: "💧" },
        { id: "rabbit", name: "いっかくうさぎ", hp: 15, attack: 4, goldReward: 20, image: "🐰" },
    ],
    "cave-1": [
        { id: "goblin", name: "ゴブリン", hp: 30, attack: 8, goldReward: 50, image: "👺" },
        { id: "wolf", name: "ウルフ", hp: 25, attack: 10, goldReward: 40, image: "🐺" },
    ]
};