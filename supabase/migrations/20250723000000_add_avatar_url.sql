/*
  # Add Avatar URL Column to Participants Table

  1. Table Updates
    - Add avatar_url column to `participants` table to store profile picture URLs
*/

-- Add avatar_url column to participants table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'participants' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE participants ADD COLUMN avatar_url text;
  END IF;
END $$;