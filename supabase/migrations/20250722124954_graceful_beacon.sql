/*
  # Create participants table for Nyandarua trip registration

  1. New Tables
    - `participants`
      - `id` (uuid, primary key)
      - `full_name` (text, not null)
      - `phone_number` (text, not null)
      - `email` (text, not null)
      - `number_of_guests` (integer, not null, default 1)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `participants` table
    - Add policy for public read access (to view participants list)
    - Add policy for public insert access (to allow registration)
    - Add unique constraint on email to prevent duplicate registrations

  3. Indexes
    - Index on email for faster lookups
    - Index on created_at for chronological sorting
*/

-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone_number text NOT NULL,
  email text NOT NULL UNIQUE,
  number_of_guests integer NOT NULL DEFAULT 1 CHECK (number_of_guests > 0 AND number_of_guests <= 10),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to participants"
  ON participants
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert for new participants"
  ON participants
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_participants_email ON participants(email);
CREATE INDEX IF NOT EXISTS idx_participants_created_at ON participants(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_participants_updated_at 
    BEFORE UPDATE ON participants 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();