import { useEffect, useState } from "react";
import type { Expedition } from "../types/game";
import "./Modal.css";

interface Props {
    isOpen: boolean;
    expedition: Expedition | null;
    onClose: () => void;
    onClaim: () => void;
}

export const ExpeditionModal = ({ isOpen, expedition, onClose, onClaim}: Props) => {
    const [timeLeftSec, setTimeLeftSec] = useState<number>(0);

    useEffect(() => {
        if (!isOpen || !expedition) return;

        const updateTimer = () => {
            const now = Date.now();
            const remainingMs = expedition.endTime - now;
            const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));
            setTimeLeftSec(remainingSec);
        }

        updateTimer();

        const timer = setInterval(updateTimer, 1000);
        return() => clearInterval(timer);
    }, [isOpen, expedition]);

    if (!isOpen || !expedition) return null;

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}分 ${secs.toString().padStart(2, "0")}秒`;
    };

    const isCompleted = timeLeftSec === 0;

    return (
        <div className="modal-overlay">
            <div className="result-card">
                <h2>遠征ステータス</h2>
                <p className="area-label">{expedition.areaName}</p>
                
                <div className="expedition-card">
                    {isCompleted ? (
                        <span className="completed">
                            チームが帰還しました！
                        </span>
                    ) : (
                        <div>
                            <div className="until">帰還まであと</div>
                            <div className="time">{formatTime(timeLeftSec)}</div>
                        </div>
                    )}
                </div>

                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                    <button className="close-button" style={{ margin: 0, flex: 1, backgroundColor: "#6b86c0" }} onClick={onClose}>
                        閉じる
                    </button>
                    <button 
                        className="close-button" 
                        style={{ 
                            margin: 0, 
                            flex: 1, 
                            backgroundColor: isCompleted ? "#4caf50" : "#555555",
                            cursor: isCompleted ? "pointer" : "not-allowed"
                        }} 
                        onClick={onClaim}
                        disabled={!isCompleted}
                    >
                        報酬受取
                    </button>
                </div>
                
            </div>
        </div>
    )
}