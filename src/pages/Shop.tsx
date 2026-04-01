import Inventory from "../components/Inventory";
import { useGame } from "../context/GameContext";
import "./Shop.css";

const Shop = () => {
    const { gameState, buyUpgrade } = useGame();
    
    if (!gameState) {
        return <div>Loading Game Data...</div>;
    }
    
    const upgradeLevel = gameState.upgradeLevel ?? 10;
    const nextCost = (upgradeLevel + 1) * 500;

    if (!gameState || Object.keys(gameState).length === 0) {
        return <div>Loading Game Data...</div>;
    }

    return (
        <div>
            <h1>ショップ</h1>
            <p>現在の所持金: {gameState.gold} G</p>
            <p>現在の生産効率: {gameState.incomePerMinute} G / 分</p>
            <hr />
            <div className="item-container">
                <h3>自動集金ツールの強化 (Lv.{gameState.upgradeLevel})</h3>
                <p>次のレベルで <b>{gameState.incomePerMinute + 5} G / 分</b> にアップ！</p>
                <p>必要費用: {nextCost} G</p>
                <button onClick={(buyUpgrade)} disabled={gameState.gold < nextCost}>
                    強化する
                </button>
            </div>
            <hr />
            <Inventory />
        </div>
    );
};

export default Shop;