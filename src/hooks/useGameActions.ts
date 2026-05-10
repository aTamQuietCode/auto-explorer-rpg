import { ITEMS } from "../data/items";
import type { GameState } from "../types/game";

export const useGameActions = (setGameState: React.Dispatch<React.SetStateAction<GameState>>) => {

    // sell Item logic
    const sellItem = (itemId: string) => {
        setGameState(prev => {
            // 1. アイテムのインデックスを探す
            const index = prev.inventory.indexOf(itemId);
            if (index === -1) return prev; // アイテムがインベントリにない場合は何もしない

            // 2. filter を使って「指定したインデックス以外の新しい配列」を作る
            // (同じIDのアイテムが複数あっても、1つだけ消すための安全な書き方)
            const newInventory = prev.inventory.filter((_, i) => i !== index);

            // 3. アイテムの売却価格をゴールドに加算
            const item = ITEMS[itemId];
            if (!item) return prev; // アイテムデータが見つからない場合は何もしない
            const price = item.sellPrice;

            // 4. 新しい状態を返す
            return {
                ...prev,
                inventory: newInventory,
                gold: prev.gold + price,
                error: null
            };
        });
    };

    // use Item logic
    const useItem = (itemId:string) => {
        setGameState(prev => {
            const item = ITEMS[itemId];
            const itemIndex = prev.inventory.indexOf(itemId);

            if (!item || itemIndex === -1 || !item.effect) return prev;

            // Remove one item from Inventory
            const newInventory = [...prev.inventory];
            newInventory.splice(itemIndex, 1);

            // apply effect        
            const nextState = {
                ...prev,
                Inventory: newInventory
            };

            if (item.effect && item.effect.type ==="SPEED_BOOST") {
                // If already have a buff, decide thether to duplicate it or set the maximum value
                nextState.nextExpeditionSpeedBoost = Math.max(0.5, prev.nextExpeditionSpeedBoost * item.effect.value);
            }

            alert(`${item.name}を使用しました！次の探索が早くなります。`);

            return nextState;
        });
    };

    // upgrade logic
    const buyUpgrade = () => {
        setGameState(prev => {
            const cost = (prev.upgradeLevel + 1) * 500;

            if (!cost || cost <= 0) return prev;
            
            // ゴールドが足りる場合、アップグレードを購入
            if (prev.gold >= cost) {
                alert("設備を強化しました！");
                return {
                    ...prev,
                    gold: prev.gold - cost,
                    upgradeLevel: prev.upgradeLevel + 1,
                    incomePerMinute: prev.incomePerMinute + 5,
                    error: null
                };
            }

            // ゴールドが足りない場合、エラーを表示
            alert("ゴールドが足りません！");
            return {
                ...prev,
                error: "ゴールドが足りません！"
            }
        });
    };

    return { sellItem, buyUpgrade, useItem };
};