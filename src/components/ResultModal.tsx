import { useGame } from "../context/GameContext";
import { ITEMS } from "../data/items";
import { MONSTERS, type Monster } from "../data/monsters";
import "./ResultModal.css";

const ResultModal = () => {
    const { gameState, closeResult } = useGame();
    const result = gameState.lastResult;

    if (!result) return null;

    const findMonsterById = (id: string) : Monster | null => {
        const allMonsters = Object.values(MONSTERS).flat();
        return allMonsters.find(m => m.id === id) || null;
    };

    return(
        <div className="modal-overlay">
            <div className="result-card">
                <h2>探索完了！</h2>
                <p className="area-label">{result.areaName}</p>
            
                <div className="reward-list">
                    {(result.defeatedMonsters || []).length > 0 && (
                    <div className="defeated-section">
                        <h3>討伐モンスター</h3>
                        <div className="monster-grid">
                            {(result.defeatedMonsters || []).map((defeated) => {
                                const monster = findMonsterById(defeated.monsterId);
                                if (!monster) return null;
                                return(
                                    <div key={defeated.monsterId} className="monster-rep">
                                        <span className="monster-icon">{monster.image}</span>
                                        <span className="monster-count">x {defeated.count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    )}
                    <div className="reward-item gold">
                        <span>獲得ゴールド:</span>
                        <span className="value">{result.gold} G</span>
                    </div>
                    
                    {result.items.map((itemId, index) => (
                        <div key={index} className="reward-item item">
                            <span>獲得アイテム:</span>
                            <span className="value">{ITEMS[itemId].name}</span>
                        </div>
                    ))}
                </div>

                <button className="close-button" onClick={closeResult}>
                    キャンプへ戻る
                </button>
            </div>
        </div>
    );
};

export default ResultModal;