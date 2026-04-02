import { useGame } from "../context/GameContext"
import { WEAPONS } from "../data/weapons";

export const useWeapons = () => {
    const { gameState, setGameState } = useGame();
    
    // 1. buy weapons
    const buyWeapon = (weaponId: string) => {
        const weapon = WEAPONS[weaponId];
        if (!weapon || gameState.gold < weapon.price) return false;
        if (gameState.ownedWeaponIds.includes(weaponId)) return false;

        setGameState(prev => ({
            ...prev,
            gold: prev.gold - weapon.price,
            ownedWeaponIds: [
                ...prev.ownedWeaponIds,
                weaponId
            ],
            equippedWeponId: weaponId,   // 購入時に自動装備
        }));

        return true;
    }

    // 2. equip a weapon
    const equipWeapon = (weaponId: string) => {
        if (!gameState.ownedWeaponIds.includes(weaponId)) return;
        setGameState(prev => ({
            ...prev,
            equippedWeaponId: weaponId
        }));
    };

    // 3. Get current equipment infomation
    const equippedWeapon = gameState.equippedWeaponId ? WEAPONS[gameState.equippedWeaponId] : null;

    return {
        buyWeapon,
        equipWeapon,
        equippedWeapon,
        ownedWeaponIds: gameState.ownedWeaponIds || [],
        allWeapons: Object.values(WEAPONS)
    } as const;
};

