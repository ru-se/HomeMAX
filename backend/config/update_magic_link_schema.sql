-- Magic Link機能用のスキーマ更新 (PostgreSQL syntax)

-- 1. homemaxテーブルに share_token カラムを追加 (ユニーク制約付き)
ALTER TABLE homemax ADD COLUMN IF NOT EXISTS share_token VARCHAR(255) UNIQUE;

-- 2. reactionsテーブルの作成 (ゲストからのリアクション)
CREATE TABLE IF NOT EXISTS reactions (
  reaction_id SERIAL PRIMARY KEY, -- PostgresではAUTO_INCREMENTではなくSERIAL
  happiness_id INT NOT NULL,      -- カラム名をDBの実態(happiness_id)に合わせました
  guest_name VARCHAR(100) NOT NULL, -- ゲスト名 (必須)
  stamp_type VARCHAR(50),           -- スタンプの種類など (DB実態は stamp_type)
  message TEXT,                     -- 応援メッセージ (任意)
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, -- Postgres推奨のTIMESTAMPTZ
  FOREIGN KEY (happiness_id) REFERENCES homemax(happiness_id) ON DELETE CASCADE
);
