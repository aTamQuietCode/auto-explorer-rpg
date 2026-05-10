import { describe, beforeEach, vi, it, expect, afterEach } from "vitest";
import { DEFAULT_STATE } from "../context/GameContext";
import { useStorage } from "./useStorage";
import { renderHook } from "@testing-library/react";

describe('useStorage Hook', () => {
    // 1. 固定したい時間を定義
    const MOCK_TIME = 1778436000000; // 2026-05-10T18:00:00Z

    // 2. 実装で使っているキー名に合わせる
    const SAVE_KEY = 'auto-explorer-rpg_save_data';

    // 各テストの前に localStorage をクリアする
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();

        // タイマーもリセットして、時刻を固定する
        vi.useFakeTimers(); // タイマーもリセット
        vi.setSystemTime(new Date(MOCK_TIME)); // 時刻を固定

        // DEFAULT_STATE 自体の lastUpdate もモック時間に合わせる
        DEFAULT_STATE.lastUpdate = MOCK_TIME;
    });

    afterEach(() => {
        // テストが終わったら時計を動かす
        vi.useRealTimers();
    });

    it('saveGame を呼ぶと localStorage にデータが保存されること', () => {
        // 1. localStorage.setItem をスパイして、呼び出しを監視する
        const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

        // 2. その後にフックをレンダリング
        const { result } = renderHook(() => useStorage(DEFAULT_STATE));

        const newState = {
            ...DEFAULT_STATE,
            gold: 999999,
            lastUpdate: Date.now()
        };

        // 3. saveGame を呼び出す
        result.current.saveGame(newState);

        console.log(localStorage);
        expect(setItemSpy).toHaveBeenCalled();
        console.log('localStorage after saveGame:', localStorage);

        // 4. localStorage.setItem が呼び出されたことを確認
        expect(setItemSpy).toHaveBeenCalled();
        const storedData = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
        expect(storedData.gold).toBe(999999);
    });

    it('loadGame を呼ぶと localStorage からデータが読み込まれること', () => {
        const testInitialState = {
            ...DEFAULT_STATE,
            lastUpdate: MOCK_TIME
        };
        const { result } = renderHook(() => useStorage(testInitialState));
        const testState = {
            ...DEFAULT_STATE,
            gold: 500
        };
        
        localStorage.setItem(SAVE_KEY, JSON.stringify(testState));

        const loadedState = result.current.loadGame();

        expect(loadedState.gold).toBe(500);
    });

    it('保存データがない場合、初期値を返すこと', () => {
        const { result } = renderHook(() => useStorage(DEFAULT_STATE));
        const loadedState = result.current.loadGame();

        // 何も保存していないので、渡した DEFAULT_STATE が返ってくるはず
        expect(loadedState).toEqual(DEFAULT_STATE);
    });
});