import React, { createContext, useContext, useState } from 'react';

// 初期タスク
const initialTasks = [
  { task_id: 1, task_title: "起床", task_name: "起きたあなた、まず一歩踏み出しただけで本当に偉い！", task_type: "当たり前タスク", status: true },
  { task_id: 2, task_title: "パソコン画面開く", task_name: "画面を灯したあなた、今日も世界にアクセスする覚悟ができてるね！", task_type: "当たり前タスク", status: true },
  { task_id: 3, task_title: "パソコン開く", task_name: "パソコンを開いたその瞬間、あなたの冒険がまた始まった！", task_type: "当たり前タスク", status: true },
  { task_id: 4, task_title: "キーボード入力", task_name: "一文字打ったあなたの手、確かに未来を動かしてるよ。", task_type: "当たり前タスク", status: false },
  { task_id: 5, task_title: "アプリ起動", task_name: "アプリを起動したあなた、その行動が未来につながってる！", task_type: "当たり前タスク", status: true },
  { task_id: 6, task_title: "サインアップ完了", task_name: "サインアップを完了したあなた、もう新世界の住人です！", task_type: "当たり前タスク", status: false },
  { task_id: 7, task_title: "ログイン", task_name: "ログインしたあなた、今日もこの世界に確かに存在しています！", task_type: "当たり前タスク", status: false },
  { task_id: 8, task_title: "早朝ログイン", task_name: "誰よりも早くログインしたあなた、まさに先頭を走る光だね！", task_type: "当たり前タスク", status: false },
  { task_id: 9, task_title: "ユーザー名正式入力", task_name: "名前を入力したあなた、その一行がこの物語の主役の証！", task_type: "当たり前タスク", status: false },
  { task_id: 10, task_title: "パスワード正式入力", task_name: "パスワードをしっかり入力できたあなた、セキュリティも気持ちも完璧です！", task_type: "当たり前タスク", status: false },
  { task_id: 11, task_title: "（英語？アルファベット？）使用", task_name: "アルファベットを使えたあなた、もはや言語の魔法使いだね！", task_type: "当たり前タスク", status: false },
  { task_id: 12, task_title: "お手紙書いた", task_name: "手紙を書いたあなた、ちゃんと誰かを思えるってすごい力だよ。", task_type: "当たり前タスク", status: false },
  { task_id: 13, task_title: "褒められた", task_name: "褒められたあなた、その実力と優しさは本物だね！", task_type: "当たり前タスク", status: false },
  { task_id: 14, task_title: "ほめマックスの隠れた帽子を探す", task_name: "ぼ、ぼくの帽子…！見つけてくれてありがとう、君、天才なの…！", task_type: "隠しタスク", status: false },
  { task_id: 15, task_title: "ほめマックスを撫でる", task_name: "やさしく撫でられたほめマックスは、今、幸せゲージ MAX！", task_type: "隠しタスク", status: false },
  { task_id: 16, task_title: "いつもありがとうと言う", task_name: "“ありがとう” が届きました。あなたの心意気、世界をあたためるね！", task_type: "隠しタスク", status: false }
];

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState(initialTasks);

  // タスクを完了にする
  const completeTask = (task_id) => {
    setTasks(tasks =>
      tasks.map(t =>
        t.task_id === task_id ? { ...t, status: true } : t
      )
    );
  };

  // タスクをtask_titleで完了
  const completeTaskByTitle = (task_title) => {
    setTasks(tasks =>
      tasks.map(t =>
        t.task_title === task_title ? { ...t, status: true } : t
      )
    );
    console.log(`Task completed: ${task_title}`);
  };


  return (
    <TasksContext.Provider value={{ tasks, completeTask, completeTaskByTitle }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);