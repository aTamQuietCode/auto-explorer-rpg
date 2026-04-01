import ActiveBuffs from '../components/ActiveBuffs';
import { useGame } from '../context/GameContext';
import { EXPLPRATION_AREAS } from '../data/areas';
import "./Explore.css";

const Explore = () => {
    const { gameState, startExpedition } = useGame();
    
    return (
        <div className='explor-container'>
            <h1>探索エリア選択</h1>
            <ActiveBuffs />
            <div className='area-list'>
                {EXPLPRATION_AREAS.map((area) => {
                    const isLocked = gameState.upgradeLevel < area.requiredLevel;
                    
                    // Caluculate time afer appllying buff
                    const actualDuration = Math.round(area.durationSec * gameState.nextExpeditionSpeedBoost);
                    
                    return (
                        <div key={area.id} className={`area-card ${isLocked ? 'locked' : ''}`}>
                            <h3>{area.name}</h3>
                            <p>{area.description}</p>
                            <p>
                                {
                                    gameState.nextExpeditionSpeedBoost < 1.0 && (
                                        <span className="buff-text"> アイテム効果中!</span>
                                    )
                                }
                            </p>
                            <p>時間: {actualDuration / 60} 分</p>
                            <button 
                                onClick={() => startExpedition(area.id, area.name, area.durationSec)}
                                disabled={isLocked || !!gameState.activeExpedition}
                            >
                                {isLocked ? `Lv.${area.requiredLevel}で解放` : "探索開始"}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Explore;