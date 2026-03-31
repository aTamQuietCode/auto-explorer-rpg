import { useGame } from '../context/GameContext';
import { EXPLPRATION_AREAS } from '../data/areas';
import "./Explore.css";

const Explore = () => {
    const { gameState, startExpedition } = useGame();
    
    return (
        <div className='explor-container'>
            <h1>探索先を選んでください</h1>
            <div className='area-list'>
                {EXPLPRATION_AREAS.map((area) => {
                    const isLocked = gameState.upgradeLevel < area.requiredLevel;
                    return (
                        <div key={area.id} className={`area-card ${isLocked ? 'locked' : ''}`}>
                            <h3>{area.name}</h3>
                            <p>{area.description}</p>
                            <p>時間: {area.durationSec / 60} 分</p>
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