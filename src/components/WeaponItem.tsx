import type { Weapon } from "../data/weapons";
import "./WeaponItem.css";

interface Props {
    weapon: Weapon;
    isOwned: boolean;
    isEquipped:boolean;
    onBuy: (id: string) => void;
    onEquip: (id: string) => void;
    canAfford: boolean;
}

export const WeaponItem = ({ weapon, isOwned, isEquipped, onBuy, onEquip, canAfford} : Props) => {
    return (
        <div className="weapon-container">
            <div className={`weapon-card ${isEquipped ? "equipped-border" : ""}`}>
                <h3>{weapon.name}</h3>
                <p>{weapon.description}</p>
                <p className="multiplier">💰 倍率: {weapon.goldMultiplier}倍</p>
                
                {isOwned ? (
                    <button disabled={isEquipped} onClick={() => onEquip(weapon.id)}>
                    {isEquipped ? "装備中" : "装備する"}
                    </button>
                ) : (
                    <button disabled={!canAfford} onClick={() => onBuy(weapon.id)}>
                    {weapon.price} G で購入
                    </button>
                )}
            </div>
        </div>
  );
};