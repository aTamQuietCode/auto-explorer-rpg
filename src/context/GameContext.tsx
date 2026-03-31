import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { GameState, Expedition } from '../types/game';
import { EXPLPRATION_AREAS } from '../data/areas';
import { ITEMS } from "../data/items";

interface GameContextType {
  gameState: GameState;
  startExpedition: (areaId: string, areaName: string, durationSec: number) => void;
  claimReward: () => void;
  importSaveData: (data: GameState) => void;
  buyUpgrade: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// 初期データ（MySQLのデフォルト値のようなもの）
const initialState: GameState = {
  gold: 0,
  inventory: [],
  activeExpedition: null,
  lastUpdate: Date.now(),
  incomePerMinute: 10,
  upgradeLevel: 0,
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [gameState, setGameState] = useState<GameState>(() => {
        const saved = localStorage.getItem("rpg_save");
        
        const savedData = saved ? JSON.parse(saved) : {};
        // Complement missing items by merging initialState with existing save data
        const data: GameState = {
            ...initialState,
            ...savedData
        };

        // Calculation of "offline reward"
        const now = Date.now();
        const offlineTimeSec = Math.floor((now - data.lastUpdate || now) / 1000);

        // Setting to automatically accumulate 10 gold per minute
        if (offlineTimeSec > 0) {
            const bonusGold = Math.floor(offlineTimeSec / 60) * (data.incomePerMinute || 10);
            if (bonusGold > 0) {
                data.gold += bonusGold;
                console.log(`不在の間に ${bonusGold}G 貯まりました！`);
            }
        }

        data.lastUpdate = now;

        // Always return a new object to avoid reverence troubles
        return data;
    });

    // Save process
    useEffect(() => {
        localStorage.setItem("rpg_save", JSON.stringify(gameState));
    }, [gameState]);

    // Update "lastUpdate" periodically (keeps time even while the app is open)
    useEffect(() => {
        const timer = setInterval(() => {
            setGameState(prev => ({ ...prev, lastUpdate: Date.now() }));
        }, 60000);  // Update every minute
        return () => clearInterval(timer);
    }, []);

    // 探索開始ロジック
    const startExpedition = (areaId: string, areaName: string, durationSec: number) => {
        if (gameState.activeExpedition) return; // すでに探索中なら何もしない

        const newExpedition: Expedition = {
            areaId,
            areaName,
            endTime: Date.now() + durationSec * 1000,
        };

        setGameState(prev => ({
            ...prev,
            activeExpedition: newExpedition,
            lastUpdate: Date.now()
        }));
    };

    // 報酬受け取り（放置時間の判定）
    const claimReward = () => {
        const { activeExpedition } = gameState;
        if (!activeExpedition) return;

        if (Date.now() >= activeExpedition.endTime) {
            // Get current explore destination data
            const area = EXPLPRATION_AREAS.find(a => a.id === activeExpedition.areaId);

            if (!area) {
                console.error("探索先データが見つかりません。");
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
            alert("まだ探索中です...");
        }
    };

    // reinforcement logic
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

    // JSONインポート用
    const importSaveData = (data: GameState) => {
        setGameState(data);
    };

    return (
        <GameContext.Provider value={{ gameState, startExpedition, claimReward, importSaveData, buyUpgrade }}>
        {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};