import { EXPLPRATION_AREAS } from "../data/areas";
import { MONSTERS } from "../data/monsters";
import { WEAPONS } from "../data/weapons";
import type { Expedition, GameState} from "../types/game";
import { useCallback } from "react";

const BASIC_WEAPON_ATTACK:number = 5;
const BASIC_MONSTER_GOLD:number = 20;
const BASIC_ENCCOUNT_PROBABILITY:number = 0.5;
const BASIC_AREA_ID:string = "forest-1";

export const useExpedition = (gameState: GameState, setGameState: React.Dispatch<React.SetStateAction<GameState>>) => {
    
    // 探索開始
    const startExpedition = (areaId: string, areaName: string, durationSec: number) => {
        if (gameState.activeExpedition) return;

        const boostedDuration = durationSec * gameState.nextExpeditionSpeedBoost;
        
        const newExpedition: Expedition = {
            areaId,
            areaName,
            startTime: Date.now(),
            endTime: Date.now() + boostedDuration * 1000,
            monstersDefeated: null
        };

        setGameState(prev => ({
            ...prev,
            activeExpedition: newExpedition,
            nextExpeditionSpeedBoost: 1.0,
            error: null
        }));
    };

    // 報酬受け取り
    const claimReward = useCallback(() => {
        setGameState(prev => {
            const { activeExpedition } = prev;

            if (!activeExpedition) return prev;

            const now = Date.now();
            if (now < activeExpedition.endTime) {
                return { ...prev, error: "まだ探索中です..." };
            }

            // --- 報酬計算ロジック（すべて prev を参照するように統一） ---
            const area = EXPLPRATION_AREAS.find(a => a.id === activeExpedition.areaId);
            if (!area) {
                // 【修正1】return prev ではなく、エラー状態の prev を返す
                return { ...prev, error: "探索先データが見つかりません。" };
            }

            const areaMonsters = MONSTERS[activeExpedition.areaId] || MONSTERS[BASIC_AREA_ID];
            
            // 【修正2】gameState ではなく prev を参照（最新の装備を反映）
            const weaponAttack = prev.equippedWeaponId ? WEAPONS[prev.equippedWeaponId].attack : BASIC_WEAPON_ATTACK;

            const totalDurationMs = activeExpedition.endTime - activeExpedition.startTime;
            const durationMin = totalDurationMs / 60000;

            let monsterGold: number = 0;
            const defeatedMap: { [key: string]: number } = {};

            const iterations = Math.max(1, Math.floor(durationMin));
            for (let i = 0; i < iterations; i++) {
                if (Math.random() < BASIC_ENCCOUNT_PROBABILITY) {
                    const monster = areaMonsters[Math.floor(Math.random() * areaMonsters.length)] || null;
                    if (monster) {
                        defeatedMap[monster.id] = (defeatedMap[monster.id] || 0) + 1;
                        monsterGold += monster.goldReward * (weaponAttack / BASIC_WEAPON_ATTACK);
                    }
                }
            }

            const defeatedMonsters = Object.entries(defeatedMap).map(([id, count]) => ({
                monsterId: id,
                count: count
            }));

            const earnedGold = BASIC_MONSTER_GOLD + Math.floor(monsterGold);

            const foundItems: string[] = [];
            area.drops.forEach(drop => {
                if (Math.random() < drop.chance) {
                    foundItems.push(drop.itemId);
                }
            });

            return {
                ...prev,
                gold: prev.gold + earnedGold,
                inventory: [...prev.inventory, ...foundItems],
                activeExpedition: null,
                error: null,
                lastResult: {
                    areaName: activeExpedition.areaName,
                    gold: earnedGold,
                    defeatedMonsters: defeatedMonsters,
                    items: foundItems
                }
            };
        });
    }, [setGameState]);

    const closeResult = () => {
        setGameState(prev => ({
            ...prev,
            lastResult: null,
            error: null
        }));
    };
    
    return { startExpedition, claimReward, closeResult };
};