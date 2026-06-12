alter table photographers
  add column if not exists subscription_cancel_at timestamptz;
