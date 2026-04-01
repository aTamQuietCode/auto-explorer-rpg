import { useGame } from "../context/GameContext";
import { ITEMS } from "../data/items";
import "./Inventory.css";

const Inventory = () => {
    const { gameState, sellItem, useItem } = useGame();

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
            return a.localeCompare(b);
        }

        // If the rarity is the same, ID order (ascending order)
        return diff;
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
                                    <button onClick={() => useItem(id)} className="use-button" >
                                        使用する
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