-- Tasksテーブルのスキーマ修正
-- 1. 既存のカラム名変更（コードに合わせる） or カラム追加
-- コード: title, is_completed, icon, color, category, xp
-- DB(現状): task_title, status, task_type, xp_gained

-- Rename task_title -> title if exists, or create title
DO $$
BEGIN
  IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'task_title') THEN
    ALTER TABLE tasks RENAME COLUMN task_title TO title;
  END IF;
END $$;

-- xp_gained -> xp
DO $$
BEGIN
  IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'xp_gained') THEN
    ALTER TABLE tasks RENAME COLUMN xp_gained TO xp;
  END IF;
END $$;

-- status -> is_completed (BOOLEAN) or keep columns
-- ここではカラムを追加して対応します
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS color TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT TRUE;

-- task_type は category と被るかもしれませんが、念のため残しておきます
