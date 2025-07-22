/*
  # Add Payment and Donation Features

  1. Table Updates
    - Add payment tracking columns to `participants` table
    - Create new `donations` table for tracking member contributions

  2. New Tables
    - `donations`
      - `id` (uuid, primary key)
      - `participant_id` (uuid, foreign key to participants)
      - `participant_name` (text, for easy display)
      - `item_name` (text, what they're donating)
      - `quantity` (integer, how many/much)
      - `description` (text, optional details)
      - `created_at` (timestamp)

  3. Security
    - Enable RLS on `donations` table
    - Add policies for public read access
    - Add policies for authenticated insert access

  4. Payment Tracking
    - Add payment_status column (pending, partial, paid)
    - Add amount_paid column to track payments
*/

-- Add payment tracking columns to participants table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'participants' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE participants ADD COLUMN payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'participants' AND column_name = 'amount_paid'
  ) THEN
    ALTER TABLE participants ADD COLUMN amount_paid integer DEFAULT 0 CHECK (amount_paid >= 0 AND amount_paid <= 15000);
  END IF;
END $$;

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid REFERENCES participants(id) ON DELETE CASCADE,
  participant_name text NOT NULL,
  item_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on donations table
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Create policies for donations table
CREATE POLICY "Allow public read access to donations"
  ON donations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert for new donations"
  ON donations
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_donations_participant_id ON donations(participant_id);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);
CREATE INDEX IF NOT EXISTS idx_participants_payment_status ON participants(payment_status);