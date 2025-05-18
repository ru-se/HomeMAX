import React, { useState, useEffect } from 'react'; // 重複を解消

import { Chart as ChartJS } from "chart.js/auto"; // Chart.jsの自動登録
import { Bar, Pie } from "react-chartjs-2"; // 名前付きエクスポートを使用

const AnalysisPage = () => {
    const [daylyLetter, setDaylyLetter] = useState([]); // 履歴データの状態を管理
    const [positiveAspects, setPositiveAspects] = useState([]); // 履歴データの状態を管理


    useEffect(() => {
        const endpoint = `http://localhost:8000/analysis/letters/dailyCount`;

        fetch(endpoint, {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                console.log("[DEBUG] Full fetched data:", data); // データ全体をログに出力
                if (data && data.result) { // resultが単一オブジェクトの場合の処理
                    const formattedData = Array.isArray(data.result)
                        ? data.result.map(item => ({
                            ...item,
                            date: new Date(item.date).toLocaleDateString() // 日付をフォーマット
                        }))
                        : [{ 
                            ...data.result, 
                            date: new Date(data.result.date).toLocaleDateString() // 単一オブジェクトを配列に変換
                        }];
                    setDaylyLetter(formattedData);
                } else {
                    console.error("[ERROR] Unexpected data structure:", data);
                    setDaylyLetter([]); // デフォルトで空配列を設定
                }
            })
            .catch(err => {
                console.error('履歴取得エラー:', err);
                setDaylyLetter([]); // エラー時も空配列を設定
            });
    }, []);

    useEffect(() => {
        const endpoint = `http://localhost:8000/analysis/homemax/positiveAspects`;

        fetch(endpoint, {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                console.log("[DEBUG] Full fetched data:", data); // データ全体をログに出力
                if (data && data.result) { // resultが単一オブジェクトの場合の処理
                    const formattedData = Array.isArray(data.result)
                        ? data.result.map(item => ({
                            ...item,
                            date: new Date(item.date).toLocaleDateString() // 日付をフォーマット
                        }))
                        : [{ 
                            ...data.result, 
                            date: new Date(data.result.date).toLocaleDateString() // 単一オブジェクトを配列に変換
                        }];
                    setPositiveAspects(formattedData);
                } else {
                    console.error("[ERROR] Unexpected data structure:", data);
                    setPositiveAspects([]); // デフォルトで空配列を設定
                }
            })
            .catch(err => {
                console.error('履歴取得エラー:', err);
                setPositiveAspects([]); // エラー時も空配列を設定
            });
    }, []);



    const graphData = {
        labels: Array.isArray(daylyLetter) ? daylyLetter.map(item => item.date) : [], // 配列であることを確認
        datasets: [
            {
                label: "Daily Letters",
                data: Array.isArray(daylyLetter) ? daylyLetter.map(item => item.count) : [], // 配列であることを確認
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true, // アスペクト比を維持してサイズ調整
        plugins: {
            legend: {
                position: "top",
            },
        },
    };

    const categories = ["仕事","恋愛","人間関係","趣味","生活のこと","愚痴","目標","健康","メンタル","自分自身のこと","将来のこと","社会のこと"]; // 分類リスト
    const categorizedCounts = categories.reduce((acc, category) => {
        acc[category] = 0; // 初期値を設定
        return acc;
    }, {});

    positiveAspects.forEach(item => {
        if (!item.positive_aspects) return; // 空文字列やundefinedをスキップ
        const aspects = item.positive_aspects.split("、"); // "、"で分割
        aspects.forEach(aspect => {
            const trimmedAspect = aspect.trim(); // 前後の空白を削除
            if (categories.includes(trimmedAspect)) {
                categorizedCounts[trimmedAspect] += item.count || 0; // カウントを加算（item.countがundefinedの場合は0）
            }
        });
    });

    const pieData = {
        labels: Object.keys(categorizedCounts), // カテゴリ名をラベルに設定
        datasets: [
            {
                data: Object.values(categorizedCounts), // カウントをデータに設定
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                    "rgba(201, 203, 207, 0.2)",
                    "rgba(100, 149, 237, 0.2)",
                    "rgba(255, 182, 193, 0.2)",
                    "rgba(144, 238, 144, 0.2)",
                    "rgba(255, 215, 0, 0.2)",
                    "rgba(135, 206, 250, 0.2)"
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                    "rgba(201, 203, 207, 1)",
                    "rgba(100, 149, 237, 1)",
                    "rgba(255, 182, 193, 1)",
                    "rgba(144, 238, 144, 1)",
                    "rgba(255, 215, 0, 1)",
                    "rgba(135, 206, 250, 1)"
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="App" style={{ maxWidth: "600px", margin: "0 auto" }}> {/* コンテナの幅を制限 */}
            
            {/* daylyLetterの内容をリストとして表示 */}
            <div>
                <h1 style={{ fontSize: "20px", textAlign: "left" }}>Daily Letters Data</h1> {/* タイトルを左寄せ */}
                <ul style={{ fontSize: "14px", textAlign: "left" }}> {/* リストを左寄せ */}
                    {daylyLetter.map((item, index) => (
                        <li key={index}>
                            {item.date}: {item.count} letters
                        </li>
                    ))}
                </ul>
                <Bar
                data={graphData}
                options={options}
                id="chart-key"
            />
                <h1 style={{ fontSize: "20px", textAlign: "left" }}>Positive Aspects</h1> {/* タイトルを左寄せ */}
                <Pie data={pieData} /> {/* 円グラフを描画 */}
            </div>
        </div>
    );
};

export default AnalysisPage;