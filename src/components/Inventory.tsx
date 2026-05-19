import { useGame } from "../context/GameContext";
import { ITEMS } from "../data/items";
import "./Inventory.css";

const Inventory = () => {
    const { gameState, sellItem, useItem: executeUseItem } = useGame();

    // Aggregate the number of items by itemID
    const itemCounts = gameState.inventory.reduce((acc, itemId) => {
        acc[itemId] = (acc[itemId] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Fixed display order (sort)
    const itemIds = Object.keys(itemCounts).sort((a, b) => {
        const itemA = ITEMS[a];
        const itemB = ITEMS[b];

        // Define rarity priority
        const rarityOrder = { 
            "Rare": 3, 
            "Uncommon": 2, 
            "Common": 1 
        };

        // Compare by rarity first (descending order)
        const diff = rarityOrder[itemB.rarity] - rarityOrder[itemA.rarity];

        if (diff !== 0) {
            return diff;
        }

        // If the rarity is the same, ID order (ascending order)
        return a.localeCompare(b);
    });

    return (
        <div className="inventory-container">
            <h2>持ち物一覧</h2>
            {itemIds.length === 0 ? (
                <p>アイテムを持っていません。</p>
            ) : (
                <div className="inventory-gird">
                    {itemIds.map((id) => {
                        const item = ITEMS[id];
                        if (!item) return null;

                        const isSpeedBoost = item.effect?.type === "SPEED_BOOST";
                        const isExploringNow = !!gameState.activeExpedition;
                        // すでにバフが適用されているか（1.0未満か）
                        const isAlreadyBuffed = gameState.nextExpeditionSpeedBoost < 1.0;
                        // 「遠征中」または「すでに使用済み」ならボタンを無効化
                        const isUseDisabled = isSpeedBoost && isExploringNow;

                        // ボタンに表示するテキストを動的に切り替え
                        let buttonText = "使用する";
                        if (isExploringNow) {
                            buttonText = "遠征中は使えません";
                        } else if (isAlreadyBuffed && isSpeedBoost) {
                            buttonText = "使用済み（1個まで）";
                        }

                        return (
                            <div key={id} className={`item-card ${item.rarity.toLowerCase()}`}>
                                <div className="item-info">
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-count">x{itemCounts[id]}</span>
                                </div>
                                <p className="item-description">{item.description}</p>
                                <div className="item-footer">
                                    <span className="item-rarity">{item.rarity}</span>
                                    <span className="item-price">{item.sellPrice} G</span>
                                </div>
                                {item.effect && (
                                    <button onClick={() => executeUseItem(id)}
                                        disabled={isUseDisabled}
                                        className={`use-button ${isUseDisabled ? "disabled" : ""}`}
                                    >
                                        {buttonText}
                                    </button>
                                )}
                                <button onClick={() => sellItem(id)} className="sell-button">
                                    売却 ({item.sellPrice} G)
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Inventory;