alter table photographers
  add column if not exists onboarding_reminder_sent_at timestamptz default null;
