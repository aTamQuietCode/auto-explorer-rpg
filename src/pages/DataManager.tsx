import { useGame } from '../context/GameContext';
import "./DataManager.css";

const DataManager = () => {
    const { gameState, importSaveData} = useGame();

    // 1. Export as JSON
    const handleExport = () => {
        const jsonString = JSON.stringify(gameState, null, 2);
        const blob = new Blob([jsonString], { type: "application/json"});
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `rpg_save_${new Date().toISOString().split("T")[0]}.json`;
        a.click();

        URL.revokeObjectURL(url);   // Free memory
    };

    // 2. Load JSON (import)
    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                // Simple validation (such as whether there is a gold property)
                if (typeof json.gold === "number") {
                    importSaveData(json);
                    alert("データを復元しました！");
                } else {
                    alert("不正なファイル形式です。");
                }
            } catch (err) {
                alert("ファイルの読み込みに失敗しました。");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div>
            <h1>データ管理</h1>
            <section>
                <h2>セーブデータのバックアップ</h2>
                <p>現在の状態をJSONファイルとして保存します。</p>
                <button onClick={handleExport}>JSONエクスポート</button>
            </section>

            <section>
                <h2>データの復元</h2>
                <p>保存したJSONファイルを読み込みます。</p>
                <input type="file" accept='.json' onChange={handleImport} />
            </section>
        </div>
    );
};

export default DataManager;