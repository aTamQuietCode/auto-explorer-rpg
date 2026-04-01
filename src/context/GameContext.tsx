import { createContext, useContext, useState, useEffect, type ReactNode, useRef } from 'react';
import type { GameState } from '../types/game';
import { useGameActions } from '../hooks/useGameActions';
import { useExpedition } from '../hooks/useExpedition';
import { useStorage } from '../hooks/useStorage';

interface GameContextType {
    gameState: GameState;
    startExpedition: (areaId: string, areaName: string, durationSec: number) => void;
    claimReward: () => void;
    closeResult: () => void;
    importSaveData: (data: GameState) => void;
    buyUpgrade: () => void;
    sellItem: (itemId: string) => void;
    useItem: (itemId: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// 初期値
const initialState: GameState = {
    gold: 0,
    inventory: [],
    activeExpedition: null,
    lastResult: null,
    nextExpeditionSpeedBoost: 1.0,
    lastUpdate: Date.now(),
    incomePerMinute: 10,
    upgradeLevel: 0,
    sellItem: "",
    useItem: "",
    buffs: {
        speedBoost: 1.0,
        goldBoost: 1.0,
        dropBoost: 1.0
    }
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const { loadGame, saveGame } = useStorage(initialState);

    // Use loadGame() as initial value
    const [gameState, setGameState] = useState<GameState>(loadGame);

    // Flag to record whether it has been displayed (does not affect rendering)
    const hasAlerted = useRef(false);

    // Gives an alert if there is any offline reward data at startup
    useEffect(() => {
        if (gameState.offlineStats && !hasAlerted.current) {
            const { minutes, gold } = gameState.offlineStats;

            hasAlerted.current = true;

            alert(`不在の ${minutes} 分間に ${gold} G 獲得しました！`);
            
            setGameState(prev => ({ 
                ...prev, 
                offlineStats: null 
            }));
        }
    }, [gameState.offlineStats]);   // include in dependent array

    const { startExpedition, claimReward, closeResult } = useExpedition(gameState, setGameState);
    const { sellItem, buyUpgrade, useItem } = useGameActions(gameState, setGameState);

    // Save process
    useEffect(() => {
        saveGame(gameState);
    }, [gameState]);

    // Update "lastUpdate" periodically (keeps time even while the app is open)
    useEffect(() => {
        const timer = setInterval(() => {
            setGameState(prev => ({ 
                ...prev, 
                lastUpdate: 
                Date.now() 
            }));
        }, 60000);  // Update every minute
        return () => clearInterval(timer);
    }, []);

    // JSONインポート用
    const importSaveData = (data: GameState) => {
        setGameState(data);
    };

    return (
        <GameContext.Provider value={{ 
            gameState, 
            startExpedition, 
            claimReward, 
            closeResult,
            importSaveData, 
            buyUpgrade,
            sellItem,
            useItem
         }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error("useGame must be used within a GameProvider");
    return context;
};