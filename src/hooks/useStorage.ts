import type { GameState } from "../types/game";

export const useStorage = (initialState: GameState) => {
    const SAVE_KEY = "rpg_save_data";

    // Load data + consistency check
    const loadGame = (): GameState => {
        const saved = localStorage.getItem(SAVE_KEY);
        if (!saved) return {
            ...initialState,
            lastUpdate: Date.now()
        };

        try {
            const parsed = JSON.parse(saved);
            const data:GameState = {
                ...initialState,
                ...parsed
            };

            // Offline reward calculation logic
            const now = Date.now();
            const lastUpdate = data.lastUpdate || now;
            const offlineTimeMinutes = Math.floor((now - lastUpdate) / (1000 * 60));

            if (offlineTimeMinutes > 0) {
                // Add gold based on production efficiency (incomePerMinites)
                const MAX_OFFLINE_MINUTES = 24 * 60; // 24時間
                const finalMinutes = Math.min(offlineTimeMinutes, MAX_OFFLINE_MINUTES);
                const earnedGold = finalMinutes * data.incomePerMinute;
                if (earnedGold > 0) {
                    data.gold += earnedGold;
                    // console.log(`${offlineTimeMinutes}分間の不在により ${earnedGold}G 獲得しました！`);
                    data.offlineStats = {
                        minutes: offlineTimeMinutes,
                        gold: earnedGold
                    };
                }
            }

            // Merge new properties with old save data
            return {
                ...data,
                lastUpdate: now
            };
        } catch (e) {
            // console.error("セーブデータの読み込みに失敗しました", e);
            return initialState;
        }
    };

    // Save data
    const saveGame = (state: GameState) => {
        // Create a copy excluding offlineStats
        const { offlineStats, ...dataToSave } = state;

        // Add latest timestamp just before saving
        const finalData = {
            ...dataToSave,
            lastUpdate: Date.now()
        }

        localStorage.setItem(SAVE_KEY, JSON.stringify(finalData));
    };

    return { loadGame, saveGame };
};