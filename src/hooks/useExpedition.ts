import { EXPLPRATION_AREAS } from "../data/areas";
import { MONSTERS } from "../data/monsters";
import { WEAPONS } from "../data/weapons";
import type { Expedition, GameState } from "../types/game";
import { useCallback } from "react";

const BASIC_WEAPON_ATTACK:number = 5;
const BASIC_MONSTER_GOLD:number = 20;
const BASIC_ENCCOUNT_PROBABILITY:number = 0.5;
const BASIC_AREA_ID:string = "forest-1";

export const useExpedition = (
    gameState: GameState,
    setGameState: React.Dispatch<React.SetStateAction<GameState>>
) => {

    // 探索開始
    const startExpedition = (areaId: string, areaName:string,  durationSec: number) => {
        if (gameState.activeExpedition) return;

        // Caluculate time by applying buffs
        const boostedDuration = durationSec * gameState.nextExpeditionSpeedBoost;
        
        const newExpedition: Expedition = {
            areaId,
            areaName,
            startTime: Date.now(),
            endTime: Date.now() + boostedDuration * 1000,
            monstersDefeated: null
        };

        alert(`探索に出発しました！`);

        setGameState(prev => ({
            ...prev,
            activeExpedition: newExpedition,
            nextExpeditionSpeedBoost: 1.0,
        }));
    };

    // 報酬受け取り（放置時間の判定）
    const claimReward = useCallback(() => {
        const { activeExpedition } = gameState;
        if (!activeExpedition) return;

        const now =  Date.now();
        if (now >= activeExpedition.endTime) {
            // Get current explore destination data
            const area = EXPLPRATION_AREAS.find(a => a.id === activeExpedition.areaId);

            if (!area) {
                // console.error("探索先データが見つかりません。");
                return;
            }

            // Get monster list according to area
            const areaMonsters = MONSTERS[activeExpedition.areaId] || MONSTERS[BASIC_AREA_ID];
            // Object for defeated record
            const defeatedMap: { [key:string]:number } = {};
            // Get weaponAttack
            const weaponAttack = gameState.equippedWeaponId ? WEAPONS[gameState.equippedWeaponId].attack : BASIC_WEAPON_ATTACK;

            // Encounter judgment with monsters
            let monsterGold:number = 0;
            let defeaterdCount:number = 0;

            // Calculation that the longer the expedition time, the more enconters ther will be.
            const durationMin:number = Math.floor((activeExpedition.endTime - activeExpedition.startTime)) / 60000;
            //console.error("durationMin", durationMin);
            for (let i = 0; i < durationMin; i++) {
                if (Math.random() < BASIC_ENCCOUNT_PROBABILITY) {
                    
                    const monster = areaMonsters[Math.floor(Math.random() * areaMonsters.length)] || [];

                    defeatedMap[monster.id] = (defeatedMap[monster.id] || 0) +1;

                    defeaterdCount++;
                    monsterGold += monster.goldReward * (weaponAttack / BASIC_WEAPON_ATTACK);
                }
            }

            const defeatedMonsters = Object.entries(defeatedMap).map(([id, count]) => ({
                monsterId: id,
                count: count
            }));
            // reflection result
            const earnedGold:number = BASIC_MONSTER_GOLD + Math.floor(monsterGold);

            // --- アイテムドロップの判定 ---
            const foundItems: string[] = [];

            area.drops.forEach(drop => {
                if (Math.random() < drop.chance) {
                    foundItems.push(drop.itemId);
                }
            });

            // --- ステートの更新 ---
            setGameState(prev => ({
                ...prev,
                gold: prev.gold + earnedGold,
                inventory: [...prev.inventory, ...foundItems], // インベントリに追加
                activeExpedition: null,
                lastResult: {
                    areaName: activeExpedition.areaName,
                    gold: earnedGold,
                    defeatedMonsters: defeatedMonsters,
                    items: foundItems
                }
            }));
        } else {
            alert(`まだ探索中です...`);
            return;
        }
    }, [gameState, setGameState]); // gameState が変わるたびに再生成される

    const closeResult = () => {
        setGameState(prev => ({
            ...prev,
            lastResult: null
        }));
    };
    
    return { startExpedition, claimReward, closeResult};
};