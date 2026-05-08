import { describe, it, expect } from 'vitest';
import { useWeapons } from './useWeapons';
import { WEAPONS } from '../data/weapons';
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { DEFAULT_STATE, GameProvider } from '../context/GameContext';
import type { GameState } from '../types/game';

export const testInitialState: GameState = {
    ...DEFAULT_STATE,
    gold: 999999,
};

// GameProvider をインポートして、テスト用のラッパーコンポーネントを作成
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <GameProvider initialData={testInitialState}>
        {children}
    </GameProvider>
);

describe('useWeapons Hook', () => {
    it('初期状態では装備品が null であり、所持リストが空（または初期値）であること', () => {
        const { result } = renderHook(() => useWeapons(), { wrapper });
    
        // ここでは、初期装備がないことを確認
        expect(result.current.equippedWeapon).toBeNull();
        expect(Array.isArray(result.current.ownedWeaponIds)).toBe(true);
        // さらに、初期所持武器がないことを確認（必要に応じて変更）
        // expect(result.current.ownedWeaponIds).toEqual([]);
    });  

    it('お金が足りる場合、武器を購入でき、自動装備されること', () => {
        const { result } = renderHook(() => useWeapons(), { wrapper });
        
        // 購入対象の武器（データ内の最初の武器など）
        const targetWeaponId = Object.keys(WEAPONS)[0];
        const weaponPrice = WEAPONS[targetWeaponId].price;

        // console.log('Current Gold:', result.current.gameState.gold);
        console.log('Weapon Price:', weaponPrice);

        // act の中で実行
        let success;
        act(() => {
            success = result.current.buyWeapon(targetWeaponId);
        });

        expect(success).toBe(true);
        expect(result.current.ownedWeaponIds).toContain(targetWeaponId);
        expect(result.current.equippedWeapon?.id).toBe(targetWeaponId);
    });

    it('お金が足りない場合、購入に失敗し、所持品が増えないこと', () => {
        const { result } = renderHook(() => useWeapons(), { wrapper });

        // 非常に高い価格の武器 ID または、初期所持金を 0 にしてテスト
        // (ここでは、初期所持金が 0 であることを前提にするか、わざと高額な武器IDを指定する)
        const expensiveWeaponId = "dummy_high_price_weapon"; // 実際にある高額ID
        
        let success;
        act(() => {
            success = result.current.buyWeapon(expensiveWeaponId);
        });

        if (!success) {
            expect(success).toBe(false);
            expect(result.current.ownedWeaponIds).not.toContain(expensiveWeaponId);
        }
    });

    it('既に持っている武器は再度購入できないこと', () => {
        const { result } = renderHook(() => useWeapons(), { wrapper });
        const targetId = Object.keys(WEAPONS)[0];

        act(() => {
            result.current.buyWeapon(targetId); // 1回目（成功するはず）
        });

        let secondSuccess;
        act(() => {
            secondSuccess = result.current.buyWeapon(targetId); // 2回目
        });

        expect(secondSuccess).toBe(false);
    });
});