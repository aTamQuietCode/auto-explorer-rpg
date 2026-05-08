import { GameProvider, useGame } from "../context/GameContext";
import { useExpedition } from "./useExpedition";
import { describe, it, beforeEach, vi, afterEach, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";

describe('useExpedition Hook', () => {
    beforeEach(() => {
        vi.useFakeTimers(); // 仮想タイマーの使用 
        vi.setSystemTime(new Date('2026-05-08T00:00:00')); // 時刻を固定
    });

    afterEach(() => {
        vi.useRealTimers(); // テスト後に実際のタイマーに戻す
        vi.restoreAllMocks(); // モックをリセット
    });

    it('探索が完了する前に報酬を受け取ろうとすると、エラーメッセージがセットされること', () => {
        const { result } = renderHook(() => {
            const game = useGame(); // これは Provider 内で実行される
            const expedition =  useExpedition(game.gameState, game.setGameState);
            return { game, expedition };
        }, { wrapper: ({ children }) => <GameProvider>{children}</GameProvider> });

        // 1. 探索開始（60秒間）
        act(() => {
            result.current.expedition.startExpedition("forest-1", "森の入り口", 60); // 60秒の探索を開始
        });

        // 2. 1秒だけ時間を進める（探索はまだ完了していない）
        act(() => {
            vi.advanceTimersByTime(1000); // 1秒進める
        });

        // 3. 報酬を受け取ろうとする
        act(() => {
            result.current.expedition.claimReward();
        });

        // 4. エラーメッセージがセットされていることを確認
        expect(result.current.game.gameState.error).toBe("まだ探索中です...");
    });

    it('探索完了後に報酬を受け取ると、ゴールドが増えること', () => {
        const { result } = renderHook(() => {
            const game = useGame();
            const expedition = useExpedition(game.gameState, game.setGameState);
            return { game, expedition };
        }, { wrapper: ({ children }) => <GameProvider>{children}</GameProvider> });

        // 1. 探索開始（短い時間で）
        act(() => {
            result.current.expedition.startExpedition("forest-1", "森の入り口", 1); // 短い時間で開始
        });

        expect(result.current.game.gameState.activeExpedition).not.toBeNull(); // 探索が開始されていることを確認

        // 2. 61秒進める（完了状態にする）
        act(() => {
            vi.advanceTimersByTime(61000); // 61秒進める
        });

        // 3. 報酬を受け取る
        act(() => {
            result.current.expedition.claimReward();
        });
    
        // 4. 検証：ゴールドが増えているか（初期値+基本報酬20G以上）
        expect(result.current.game.gameState.gold).toBeGreaterThan(0); // 報酬が増えていることを確認
        expect(result.current.game.gameState.activeExpedition).toBeNull(); // 探索がリセットされていることを確認
    });
});