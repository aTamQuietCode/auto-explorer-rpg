import { useGame } from "../context/GameContext";
import "./Exploring.css";

const Exploring = () => {
    const {gameState, claimReward} = useGame();
    if (!gameState.activeExpedition) return;
    
    return (
        <>
        <div className="exploration-status">
            <p>{gameState.activeExpedition.areaName} を探索中...</p>
            <div className="monster-scanner">
                {/* walking */}
                <span className="walking-character">🚶‍♂️...</span>
                <span className="current-enemy">👾？</span>
            </div>
        </div>
        <button onClick={claimReward}>帰還を確認する</button>
        </>
    );
};

export default Exploring;