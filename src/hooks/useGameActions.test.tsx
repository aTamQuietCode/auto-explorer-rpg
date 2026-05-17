import { GameProvider, useGame } from "../context/GameContext";
import { alertTimestamps, useGameActions } from "./useGameActions";
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <GameProvider>
        {children}
    </GameProvider>
);

describe('useGameActions Hook', () => {

    beforeEach(() => {
        vi.spyOn(window, 'alert').mockImplementation(() => {}); // alert をモック
        alertTimestamps.lastItemTime = 0;
        alertTimestamps.lastUpgradeTime = 0;
    });

    afterEach(() => {
        vi.restoreAllMocks(); // モックをリセット
    });

    it('アイテムを売ると、ゴールドが増え、インベントリからアイテムが減ること', async () => {
        const { result } = renderHook(() => {
            const game = useGame();
           return {
                game,
                sellItem: (id: string) => useGameActions(game.gameState, game.setGameState).sellItem(id)
            };
        }, { wrapper });

        // 1. 初期状態のセット
        await act(async () => {
            result.current.game.setGameState(prev => ({
                ...prev,
                inventory: ['potion'], // 'potion' をインベントリに追加
                gold: 0
            }));
        });

        // 2. アイテムを売る
        await act(async () => {
            result.current.sellItem('potion');
        });

        // 検証
        expect(result.current.game.gameState.inventory).not.toContain('potion');
        expect(result.current.game.gameState.gold).toBeGreaterThan(0);
    });

    it('ゴールドが足りる場合、アップグレードを購入できること', async () => {
        const { result } = renderHook(() => {
            const game = useGame();
            const actions = useGameActions(game.gameState, game.setGameState);
            return { game, actions };
        }, { wrapper });

        // 1. 初期状態を設定
        await act(async () => {
            result.current.game.setGameState(prev => ({
                ...prev,
                gold: 100000,
                upgradeLevel: 0
            }));
        });

        // 2. アップグレードを購入
        await act(async () => {
            result.current.actions.buyUpgrade();
        });

        // 3. 検証
        expect(window.alert).toHaveBeenCalledWith("設備を強化しました！");
        expect(result.current.game.gameState.gold).toBeLessThan(100000);
        expect(result.current.game.gameState.upgradeLevel).toBe(1);
    });
    
    it('ゴールドが足りない場合、アップグレードを購入できないこと', async () => {
        const { result } = renderHook(() => {
            const game = useGame();
            const actions = useGameActions(game.gameState, game.setGameState);
            return { game, actions };
        }, { wrapper });

        // 1. 初期状態を設定
        await act(async () => {
            result.current.game.setGameState(prev => ({
                ...prev,
                gold: 0,
                upgradeLevel: 0
            }));
        });

        // 2. アップグレードを購入
        await act(async () => {
            result.current.actions.buyUpgrade();
        });

        // 3. 検証
        expect(window.alert).toHaveBeenCalledWith("ゴールドが足りません！");
        expect(result.current.game.gameState.gold).toBe(0);
        expect(result.current.game.gameState.upgradeLevel).toBe(0);
    });

    it('アイテムを使用すると、インベントリからアイテムが減り、効果が適用されること', async () => {
        const { result } = renderHook(() => {
            const game = useGame();
            return {
                game,
                executeUseItem: (id: string) => useGameActions(game.gameState, game.setGameState).useItem(id)
            };
        }, { wrapper });

        // 1. 初期状態を設定
        await act(async () => {
            result.current.game.setGameState(prev => ({
                ...prev,
                inventory: ['potion'],
                activeExpedition: null,
                nextExpeditionSpeedBoost: 1.0,
                error: null
            }));
        });

        // 2. アイテムを使用（新しく作ったラッパー経由で、最新のStateを乗せて実行）
        await act(async () => {
            result.current.executeUseItem('potion');
        });

        // 3. 検証
        expect(window.alert).toHaveBeenCalledWith("ポーションを使用しました！次の探索が早くなります。");
        expect(result.current.game.gameState.inventory).not.toContain('potion');
        expect(result.current.game.gameState.nextExpeditionSpeedBoost).toBeLessThan(1.0);
    });
});