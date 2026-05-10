import { GameProvider, useGame } from "../context/GameContext";
import { useGameActions } from "./useGameActions";
import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <GameProvider>
        {children}
    </GameProvider>
);

describe('useGameActions Hook', () => {
    it('アイテムを売ると、ゴールドが増え、インベントリからアイテムが減ること', async () => {
        const { result } = renderHook(() => {
            const game = useGame();
            return { 
                gameState: game.gameState,
                setGameState: game.setGameState,
                actions: useGameActions(game.setGameState)
             };
        }, { wrapper });

        // 1. 初期状態のセット
        await act(async () => {
            result.current.setGameState(prev => ({
                ...prev,
                inventory: ['potion'], // 例: 'potion' をインベントリに追加
                gold: 0 // 初期ゴールドは0
            }));
        });

        // 2. アイテムを売る（必ず result.current.actions を経由する）
        await act(async () => {
            result.current.actions.sellItem('potion'); // 例: 'potion' を売る
        });

        // 検証
        // 最新の状態を取得できているか確認
        const finalInventory = result.current.gameState.inventory;
        const finalGold = result.current.gameState.gold;

        console.log('Final Inventory:', finalInventory);
        console.log('Final Gold:', finalGold);

        expect(finalInventory).not.toContain('potion'); // インベントリからアイテムが減っていること
        expect(finalGold).toBeGreaterThan(0); // ゴールドが増えていること（初期値が0の場合）
    });

    it('ゴールドが足りる場合、アップグレードを購入できること', () => {
        const { result } = renderHook(() => {
            const game = useGame();
            const actions = useGameActions(game.setGameState);
            return { game, actions };
        }, { wrapper });

        // 1. 初期状態を設定
        act(() => {
            result.current.game.setGameState(prev => ({
                ...prev,
                gold: 100000, // 十分なゴールドを設定
                upgradeLevel: 0
            }));
        });

        // 2. アップグレードを購入
        act(() => {
            result.current.actions.buyUpgrade(); // 例: upgrade を購入
        });

        // 3. 検証
        expect(result.current.game.gameState.gold).toBeLessThan(100000); // ゴールドが減っていること
        expect(result.current.game.gameState.upgradeLevel).toBe(1); // アップグレードレベルが上がっていること
    });
    
    it('ゴールドが足りない場合、アップグレードを購入できないこと', () => {
        const { result } = renderHook(() => {
            const game = useGame();
            const actions = useGameActions(game.setGameState);
            return { game, actions };
        }, { wrapper });

        // 1. 初期状態を設定
        act(() => {
            result.current.game.setGameState(prev => ({
                ...prev,
                gold: 0, // ゴールドが足りない状態
                upgradeLevel: 0
            }));
        });

        // 2. アップグレードを購入
        act(() => {
            result.current.actions.buyUpgrade(); // 例: upgrade を購入
        });

        // 3. 検証
        expect(result.current.game.gameState.gold).toBe(0); // ゴールドが減っていないこと
        expect(result.current.game.gameState.upgradeLevel).toBe(0); // アップグレードレベルが上がっていないこと
    });

    afterEach(() => {
        vi.restoreAllMocks(); // モックをリセット
    });
});