import { EXPLPRATION_AREAS } from "../data/areas";
import { ITEMS } from "../data/items";
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

        setGameState(prev => ({
            ...prev,
            activeExpedition: newExpedition,
            nextExpeditionSpeedBoost: 1.0,
        }));
    };

    // 報酬受け取り（放置時間の判定）
    const claimReward = useCallback(() => {
        const { activeExpedition } = gameState;
        if (!activeExpedition) {
            // console.log("探索中ではありません。");
            return;
        }

        const now =  Date.now();
        if (now >= activeExpedition.endTime) {
            // Get current explore destination data
            const area = EXPLPRATION_AREAS.find(a => a.id === activeExpedition.areaId);

            if (!area) {
                // console.error("探索先データが見つかりません。");
                return;
            }

            // --- ゴールド報酬の計算 (既存) ---
            const rewardGold = Math.floor(Math.random() * (area.maxGold - area.minGold + 1)) + area.minGold;

            // --- アイテムドロップの判定 ---
            const obtainedItems: string[] = [];

            area.drops.forEach(drop => {
                if (Math.random() < drop.chance) {
                    obtainedItems.push(drop.itemId);
                }
            });

            // --- ステートの更新 ---
            setGameState(prev => ({
                ...prev,
                gold: prev.gold + rewardGold,
                inventory: [...prev.inventory, ...obtainedItems], // インベントリに追加
                activeExpedition: null,
            }));
            const itemNames = obtainedItems.map(id => ITEMS[id].name).join("、");
            const itemMsg = obtainedItems.length > 0 ? `\nアイテム入手: ${itemNames}` : "";
            alert(`${area.name} から帰還！\n${rewardGold} ゴールド獲得！${itemMsg}`);
        } else {                
            // const remain = Math.ceil((activeExpedition.endTime - now) / 1000);
            // console.log(`まだ探索中です...残り ${remain}秒`);
            alert(`まだ探索中です...`);
            return;
        }
    }, [gameState, setGameState]); // gameState が変わるたびに再生成される
    
    return { startExpedition, claimReward };
};