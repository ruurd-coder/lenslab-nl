CREATE TABLE contact_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  photographer_id uuid REFERENCES photographers(id) ON DELETE CASCADE NOT NULL,
  sender_name text NOT NULL,
  sender_email text NOT NULL,
  sender_phone text,
  message text NOT NULL,
  is_read boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Photographers can read their own messages (matched by email)
CREATE POLICY "Photographers read own messages" ON contact_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM photographers p
      WHERE p.id = photographer_id
        AND p.email = auth.email()
    )
  );

-- Photographers can mark their own messages as read
CREATE POLICY "Photographers update own messages" ON contact_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM photographers p
      WHERE p.id = photographer_id
        AND p.email = auth.email()
    )
  );
