import { useGame } from "../context/GameContext";
import "./ActiveBuffs.css";

const ActiveBuffs = ({ showDetail = false}: {showDetail?: boolean}) => {
    const { gameState } = useGame();
    const boost = gameState.nextExpeditionSpeedBoost;

    // If the magnification is 1.0(equal magnification), nothing is displayed
    if (boost >= 1.0) return null;

    // Convert to percentage
    const reductionPercent = Math.round((1 - boost)  * 100);

    return (
        <div className={`active-buffs ${showDetail ? 'detail-mode' : ''}`}>
            <div className="buff-badge speed-boost">
                <span className="icon">🚀</span>
                {showDetail && <span className="description">スタミナ全開！</span>}
                <span className="value">次回探索 {reductionPercent}% 短縮</span>
            </div>
        </div>
    );
};

export default ActiveBuffs;