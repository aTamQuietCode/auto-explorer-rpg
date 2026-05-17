import { useState } from "react";
import { useGame } from "../context/GameContext";
import { ExpeditionModal } from "./ExpeditionModal";
import "./Exploring.css";

const Exploring = () => {
    const {gameState, claimReward} = useGame();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!gameState.activeExpedition) return null;
    const currentExpedition = gameState.activeExpedition;

    const handleCheckStatus = () => {
        const now = Date.now();

        if (now >= currentExpedition.endTime) {
            claimReward();
        } else {
            setIsModalOpen(true);
        }
    };

    const handleClaimFromModal = () => {
        claimReward();
        setIsModalOpen(false);
    }
    
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

        {gameState.error && <p style={{ color: "#ff5252", fontSize: "0.9rem" }}>{gameState.error}</p>}
        <button onClick={handleCheckStatus}>遠征状況を確認する</button>

        {/* 時間表示用モーダル */}
        <ExpeditionModal 
            isOpen={isModalOpen}
            expedition={currentExpedition}
            onClose={() => setIsModalOpen(false)}
            onClaim={handleClaimFromModal}
        />
        </>
    );
};

export default Exploring;