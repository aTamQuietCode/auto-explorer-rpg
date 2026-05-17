import { ITEMS } from "../data/items";
import type { GameState } from "../types/game";

export const useGameActions = (gameState: GameState, setGameState: React.Dispatch<React.SetStateAction<GameState>>) => {
    let lastUpgradeAlertTime = 0;

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
        const item = ITEMS[itemId];
        if (!item || !item.effect) return;

        let usedSuccessfully = false;
        let errorMessage = "";

        setGameState(prev => {
            const itemIndex = prev.inventory.indexOf(itemId);
            if (itemIndex === -1) return prev; // インベントリになければ何もしない

            // スピードブーストかつ遠征中なら何もしない
           if (item.effect?.type === "SPEED_BOOST" && prev.nextExpeditionSpeedBoost < 1.0) {
                errorMessage = "アイテムは1回の探索につき1個までしか使用できません。";
                return prev;
            }
            usedSuccessfully = true;

            const newInventory = prev.inventory.filter((_, i) => i !== itemIndex);

            // Apply effect
            if (item.effect?.type === "SPEED_BOOST") {
                const newSpeedBoost = Math.max(0.5, prev.nextExpeditionSpeedBoost * item.effect.value);
                return {
                    ...prev,
                    inventory: newInventory,
                    nextExpeditionSpeedBoost: newSpeedBoost,
                    error: null
                };
            }
            return prev;
        });

        if (usedSuccessfully) {
            alert(`${item.name}を使用しました！次の探索が早くなります。`);
        } else if (errorMessage) {
            alert(errorMessage);
        }
    };

    // upgrade logic
    const buyUpgrade = () => {
        // 1. setGameState の「外側」で、現在の gameState を直接使って判定する
        const cost = (gameState.upgradeLevel + 1) * 500;

        // 前回の実行から 500ミリ秒（0.5秒）以内の呼び出しは、システムによる自動実行とみなして完全にスルーする
        const now = Date.now();
        if (now - lastUpgradeAlertTime < 500) {
            return; 
        }

        // ゴールドが足りない場合、ここで即終了（setGameState すら呼ばない）
        if (gameState.gold < cost) {
            lastUpgradeAlertTime = Date.now();
            alert("ゴールドが足りません！");
            setGameState(prev => ({ ...prev, error: "ゴールドが足りません！" }));
            return;
        }

        lastUpgradeAlertTime = Date.now();
        // 2. ここに到達したということは「確実に購入可能」。先にアラートを出す
        alert("設備を強化しました！");

        // 3. 状態の更新だけをシンプルに行う（中でのフラグ書き換えは一切しない）
        setGameState(prev => {
            return {
                ...prev,
                gold: prev.gold - cost,
                upgradeLevel: prev.upgradeLevel + 1,
                incomePerMinute: prev.incomePerMinute + 5,
                error: null
            };
        });
    };

    return { sellItem, buyUpgrade, useItem };
};