import { useGame } from "../context/GameContext";

const Home = () => {
    const {gameState, claimReward} = useGame();

    return (
        <div>
            <h1>マイキャンプ</h1>
            <p>所持金: {gameState.gold} G</p>
        
            {gameState.activeExpedition ? (
                <div>
                    <p>現在 {gameState.activeExpedition.areaName} を探索中...</p>
                    <button onClick={claimReward}>帰還を確認する</button>
                </div>
                ) : (
                    <p>待機中。探索に出発しましょう！</p>
                )
            }
        </div>
    );
};

export default Home;