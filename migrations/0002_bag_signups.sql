create table if not exists bag_signups (
  id text primary key,
  trip_date date not null,
  pack_date date not null,
  teacher text not null,
  group_name text not null,
  destination text not null default '',
  pickup_time text not null default '',
  students jsonb not null default '[]',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create index if not exists bag_signups_status_idx on bag_signups (status, pack_date);
