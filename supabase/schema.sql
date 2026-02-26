-- Alzhra Cinema | سينما الزهراء
-- Database Schema (Updated for Simplified Architecture)

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Create Movies Table
create table if not exists movies (
    id uuid default uuid_generate_v4() primary key,
    title_ar text not null,
    title_en text not null,
    description_ar text,
    description_en text,
    poster_url text,
    genre_ar text,
    genre_en text,
    duration integer, -- in minutes
    is_active boolean default true,
    release_date date,
    created_at timestamp with time zone default now()
);

-- 3. Create Showtimes Table
create table if not exists showtimes (
    id uuid default uuid_generate_v4() primary key,
    movie_id uuid references movies(id) on delete cascade,
    hall_name_ar text,
    hall_name_en text,
    show_date date not null,
    show_time time not null,
    created_at timestamp with time zone default now()
);

-- 4. Enable RLS
alter table movies enable row level security;
alter table showtimes enable row level security;

-- 5. Policies for Movies
create policy "Allow public read access for active movies"
on movies for select
using (is_active = true);

create policy "Allow full access for authenticated users"
on movies for all
to authenticated
using (true)
with check (true);

-- 6. Policies for Showtimes
create policy "Allow public read access for showtimes"
on showtimes for select
using (true);

create policy "Allow full access for authenticated users"
on showtimes for all
to authenticated
using (true)
with check (true);
