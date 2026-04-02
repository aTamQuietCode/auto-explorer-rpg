import { Link } from "react-router-dom";
import ActiveBuffs from "../components/ActiveBuffs";
import { useGame } from "../context/GameContext";
import "./Home.css";
import { WEAPONS } from "../data/weapons";

const Home = () => {
    const {gameState, claimReward} = useGame();
    //const weapon = WEAPONS[gameState.equippedWeaponId];

    return (
        <div>
            <h1>マイキャンプ</h1>

            <section className="status-section">
                <p>所持金: {gameState.gold} G</p>
                <p>強化レベル: Lv.{gameState.upgradeLevel}</p>
                <p>武器: {gameState.equippedWeaponId ? `${WEAPONS[gameState.equippedWeaponId].name} 💰倍率:${WEAPONS[gameState.equippedWeaponId].goldMultiplier}倍` : "なし"}</p>
                
                <ActiveBuffs />
            </section>
        
            {gameState.activeExpedition ? (
                    <div>
                        <p>現在 {gameState.activeExpedition.areaName} を探索中...</p>
                        <button onClick={claimReward}>帰還を確認する</button>
                    </div>
                ) : (
                    <div>
                        <p>待機中。探索に出発しましょう！</p>
                        <Link to='/explore' className="nav-button">探索へ出発</Link>
                    </div>
                )
            }
        </div>
    );
};

export default Home;