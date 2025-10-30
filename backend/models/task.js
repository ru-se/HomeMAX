const db = require("../config/db");

// タスク一覧取得
exports.getTaskList = async (userId) => {
  const query = `
        SELECT *
        FROM Tasks
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;
  return new Promise((resolve, reject) => {
    db.query(query, [userId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

// クリア済みタスク取得
exports.getClearedTasks = async (userId) => {
  const query = `
        SELECT *
        FROM Tasks
        WHERE user_id = ? AND status = 'true'
    `;
  return new Promise((resolve, reject) => {
    db.query(query, [userId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

// タスクのクリア状況（ステータス）を更新
exports.updateTaskStatusByName = async (task_title, status) => {
  const query = `
        UPDATE Tasks
        SET status = ?
        WHERE task_title = ?
    `;
  return new Promise((resolve, reject) => {
    db.query(query, [status, task_title], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

exports.getTaskNameByTitle = async (task_title) => {
  const query =
    "SELECT task_name, status FROM Tasks WHERE task_title = ? LIMIT 1";
  return new Promise((resolve, reject) => {
    db.query(query, [task_title], (err, rows) => {
      if (err) return reject(err);
      // task_nameとstatusの両方を返す
      resolve(
        rows[0]
          ? { task_name: rows[0].task_name, status: rows[0].status }
          : { task_name: "", status: "" }
      );
    });
  });
};

exports.createInitialTasks = async (userId) => {
  const taskQuery =
    "INSERT INTO tasks(task_title, task_name, task_type, status, user_id) VALUES ?";
  const initialTasks = [
    [
      "起床",
      "起きたあなた、まず一歩踏み出しただけで本当に偉い！",
      "当たり前タスク",
      "true",
      userId,
    ],
    [
      "パソコン画面開く",
      "画面を灯したあなた、今日も世界にアクセスする覚悟ができてるね！",
      "当たり前タスク",
      "true",
      userId,
    ],
    [
      "パソコン開く",
      "パソコンを開いたその瞬間、あなたの冒険がまた始まった！",
      "当たり前タスク",
      "true",
      userId,
    ],
    [
      "キーボード入力",
      "一文字打ったあなたの手、確かに未来を動かしてるよ。",
      "当たり前タスク",
      "false",
      userId,
    ],
    [
      "アプリ起動",
      "アプリを起動したあなた、その行動が未来につながってる！",
      "当たり前タスク",
      "true",
      userId,
    ],
    [
      "サインアップ完了",
      "サインアップを完了したあなた、もう新世界の住人です！",
      "当たり前タスク",
      "false",
      userId,
    ],
    [
      "ログイン",
      "ログインしたあなた、今日もこの世界に確かに存在しています！",
      "当たり前タスク",
      "false",
      userId,
    ],
    [
      "早朝ログイン",
      "誰よりも早くログインしたあなた、まさに先頭を走る光だね！",
      "当たり前タスク",
      "false",
      userId,
    ],
    [
      "ユーザー名正式入力",
      "名前を入力したあなた、その一行がこの物語の主役の証！",
      "当たり前タスク",
      "false",
      userId,
    ],
    [
      "パスワード正式入力",
      "パスワードをしっかり入力できたあなた、セキュリティも気持ちも完璧です！",
      "当たり前タスク",
      "false",
      userId,
    ],
    [
      "（英語？アルファベット？）使用",
      "アルファベットを使えたあなた、もはや言語の魔法使いだね！",
      "当たり前タスク",
      "false",
      userId,
    ],
    [
      "お手紙書いた",
      "手紙を書いたあなた、ちゃんと誰かを思えるってすごい力だよ。",
      "当たり前タスク",
      "false",
      userId,
    ],
    [
      "褒められた",
      "褒められたあなた、その実力と優しさは本物だね！",
      "当たり前タスク",
      "false",
      userId,
    ],
    [
      "ほめマックスの隠れた帽子を探す",
      "ぼ、ぼくの帽子…！見つけてくれてありがとう、君、天才なの…！",
      "隠しタスク",
      "false",
      userId,
    ],
    [
      "ほめマックスを撫でる",
      "やさしく撫でられたほめマックスは、今、幸せゲージ MAX！",
      "隠しタスク",
      "false",
      userId,
    ],
    [
      "いつもありがとうと言う",
      "“ありがとう” が届きました。あなたの心意気、世界をあたためるね！",
      "隠しタスク",
      "false",
      userId,
    ],
  ];
  try {
    await db.query(taskQuery, [initialTasks]);
  } catch (error) {
    console.error("初期タスクの作成に失敗しました:", error);
    throw error; // エラーを呼び出し元に伝える
  }
};
