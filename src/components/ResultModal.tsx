import { useGame } from "../context/GameContext";
import { ITEMS } from "../data/items";
import "./ResultModal.css";

const ResultModal = () => {
    const { gameState, closeResult } = useGame();
    const result = gameState.lastResult;

    if (!result) return null;

    return(
        <div className="modal-overlay">
            <div className="result-card">
                <h2>探索完了！</h2>
                <p className="area-label">{result.areaName}</p>
            
                <div className="reward-list">
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