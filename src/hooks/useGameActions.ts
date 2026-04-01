import { ITEMS } from "../data/items";
import type { GameState } from "../types/game";

export const useGameActions = (
    gameState: GameState,
    setGameState: React.Dispatch<React.SetStateAction<GameState>>
) => {

    // sell Item logic
    const sellItem = (itemId: string) => {
        const item = ITEMS[itemId];
        const itemIndex = gameState.inventory.indexOf(itemId);
        if (!item || itemIndex === -1) return;

        const newInventory = [...gameState.inventory];
        newInventory.splice(itemIndex, 1); // 1つだけ削除

        setGameState(prev => ({
            ...prev,
            gold: prev.gold + item.sellPrice,
            inventory: newInventory
        }));
    };

    // use Item logic
    const useItem = (itemId:string) => {
        const item = ITEMS[itemId];
        const itemIndex = gameState.inventory.indexOf(itemId);

        if (!item || itemIndex === -1 || !item.effect) return;

        // Remove one item from Inventory
        const newInventory = [...gameState.inventory];
        newInventory.splice(itemIndex, 1);

        // apply effect
        setGameState(prev => {
            const nextState = {
                ...prev,
                Inventory: newInventory
            };

            if (item.effect && item.effect.type ==="SPEED_BOOST") {
                // If already have a buff, decide thether to duplicate it or set the maximum value
                nextState.nextExpeditionSpeedBoost = Math.max(0.5, prev.nextExpeditionSpeedBoost * item.effect.value);
            }

            return nextState;
        });

        alert(`${item.name}を使用しました！次の探索が早くなります。`)
    };

    // upgrade logic
    const buyUpgrade = () => {
        const cost = (gameState.upgradeLevel + 1) * 500;
        if (gameState.gold >= cost) {
            setGameState(prev => ({
                ...prev,
                gold: prev.gold - cost,
                upgradeLevel: prev.upgradeLevel + 1,
                incomePerMinute: prev.incomePerMinute + 5,
            }));
            alert("設備を強化しました！");
        } else {
            alert("ゴールドが足りません！");
        }
    };

    return { sellItem, buyUpgrade, useItem };
};