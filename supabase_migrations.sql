-- Create a table for public profiles if it doesn't exist
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  email text,
  full_name text,
  role text default 'member',
  phone text,
  address text,

  constraint username_length check (char_length(full_name) >= 3)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- This is critical for OAuth (Google) logins where the frontend might fail to insert due to timing/race conditions.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    'member'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create prayer_requests table
create table if not exists public.prayer_requests (
  id serial primary key,
  user_id uuid references auth.users,
  request_text text not null,
  is_private boolean default false,
  status text default 'pending' check (status in ('pending', 'prayed', 'archived')),
  submitter_name text,
  submitter_email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on prayer_requests
alter table public.prayer_requests enable row level security;

-- Anyone can insert prayer requests (public form)
create policy "Anyone can submit prayer requests"
  on prayer_requests for insert
  with check ( true );

-- Users can view their own requests
create policy "Users can view own requests"
  on prayer_requests for select
  using ( auth.uid() = user_id );

-- Admins can view all requests
create policy "Admins can view all requests"
  on prayer_requests for select
  using ( 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'pastor')
    )
  );

-- Admins can update requests (status changes)
create policy "Admins can update requests"
  on prayer_requests for update
  using ( 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'pastor')
    )
  );

-- Admins can delete requests
create policy "Admins can delete requests"
  on prayer_requests for delete
  using ( 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'pastor')
    )
  );
