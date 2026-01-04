/*
  # Create waitlist table for deposit.now

  1. New Tables
    - `waitlist`
      - `id` (uuid, primary key) - Unique identifier for each signup
      - `email` (text, unique, not null) - Email address of the user
      - `created_at` (timestamptz, default now()) - Timestamp of signup
      - `referral_source` (text, nullable) - Optional tracking of where they came from
      
  2. Security
    - Enable RLS on `waitlist` table
    - Add policy for public INSERT access (anyone can sign up)
    - Add policy for service role to SELECT (for admin dashboard later)
    
  3. Notes
    - Email is unique to prevent duplicate signups
    - Created_at helps track signup velocity
    - Simple structure for MVP, can extend later with status, invite codes, etc.
*/

CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  referral_source text
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert their email (public signup)
CREATE POLICY "Anyone can sign up for waitlist"
  ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to view waitlist (for future admin dashboard)
CREATE POLICY "Authenticated users can view waitlist"
  ON waitlist
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);