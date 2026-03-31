import { useGame } from "../context/GameContext";
import "./Shop.css";

const Shop = () => {
    const { gameState, buyUpgrade } = useGame();
    
    // 1. まず gameState 自体が存在するかチェック
    if (!gameState) {
        return <div>Loading Game Data...</div>;
    }
    
    // 2. 必要なプロパティが存在するかチェック（undefinedを回避）
    const gold = gameState.gold ?? 0;
    const upgradeLevel = gameState.upgradeLevel ?? 10;
    const incomePerMinute = gameState.incomePerMinute ?? 0;
    const nextCost = (upgradeLevel + 1) * 500;

    if (!gameState || Object.keys(gameState).length === 0) {
        return <div>Loading Game Data...</div>;
    }

    console.log("Current gold:", gameState?.gold);
    if (!gameState) {
        console.error("gameState が定義されていません。");
    } else {
        console.log("Raw gameState:", gameState);
        console.log("Keys found:", Object.keys(gameState || {}));
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
        </div>
    );
};

export default Shop;