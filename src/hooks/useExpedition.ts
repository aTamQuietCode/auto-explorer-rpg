import { EXPLPRATION_AREAS } from "../data/areas";
import type { Expedition, GameState } from "../types/game";
import { useCallback } from "react";

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
            endTime: Date.now() + boostedDuration * 1000,
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

            // --- ゴールド報酬の計算 (既存) ---
            const earnedGold = Math.floor(Math.random() * (area.maxGold - area.minGold + 1)) + area.minGold;

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