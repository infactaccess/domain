create extension if not exists pgcrypto with schema extensions;
create extension if not exists vector with schema extensions;

create or replace function public.set_bintu_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.bump_bintu_session_activity()
returns trigger
language plpgsql
as $$
begin
  update public.chat_sessions
  set
    updated_at = new.created_at,
    last_message_at = new.created_at
  where id = new.session_id;

  return new;
end;
$$;

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text,
  category text,
  source_url text,
  source_path text not null unique,
  checksum text,
  status text not null default 'ready' check (status in ('draft', 'ready', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  content_text text not null default '',
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents (id) on delete cascade,
  chunk_index integer not null check (chunk_index >= 0),
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  embedding extensions.vector(512),
  created_at timestamptz not null default timezone('utc', now()),
  unique (document_id, chunk_index)
);

create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  last_message_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  sources jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists documents_status_idx
  on public.documents (status, created_at desc);

create index if not exists document_chunks_document_idx
  on public.document_chunks (document_id, chunk_index);

create index if not exists chat_sessions_user_last_message_idx
  on public.chat_sessions (user_id, last_message_at desc);

create index if not exists chat_messages_session_created_idx
  on public.chat_messages (session_id, created_at asc);

create index if not exists chat_messages_user_created_idx
  on public.chat_messages (user_id, created_at desc);

create index if not exists document_chunks_embedding_hnsw_idx
  on public.document_chunks
  using hnsw (embedding extensions.vector_cosine_ops);

drop trigger if exists documents_set_bintu_updated_at on public.documents;
create trigger documents_set_bintu_updated_at
before update on public.documents
for each row
execute function public.set_bintu_updated_at();

drop trigger if exists chat_sessions_set_bintu_updated_at on public.chat_sessions;
create trigger chat_sessions_set_bintu_updated_at
before update on public.chat_sessions
for each row
execute function public.set_bintu_updated_at();

drop trigger if exists chat_messages_bump_bintu_session_activity on public.chat_messages;
create trigger chat_messages_bump_bintu_session_activity
after insert on public.chat_messages
for each row
execute function public.bump_bintu_session_activity();

create or replace function public.match_document_chunks(
  query_embedding extensions.vector(512),
  match_threshold float default 0.68,
  match_count int default 5,
  filter_document_ids uuid[] default null
)
returns table (
  chunk_id uuid,
  document_id uuid,
  title text,
  category text,
  source_url text,
  chunk_index integer,
  content text,
  metadata jsonb,
  similarity double precision
)
language sql
stable
as $$
  select
    dc.id as chunk_id,
    dc.document_id,
    d.title,
    d.category,
    d.source_url,
    dc.chunk_index,
    dc.content,
    dc.metadata,
    1 - (dc.embedding <=> query_embedding) as similarity
  from public.document_chunks dc
  join public.documents d
    on d.id = dc.document_id
  where
    dc.embedding is not null
    and d.status = 'ready'
    and (filter_document_ids is null or dc.document_id = any (filter_document_ids))
    and 1 - (dc.embedding <=> query_embedding) >= match_threshold
  order by dc.embedding <=> query_embedding asc
  limit greatest(match_count, 1);
$$;

alter table public.documents enable row level security;
alter table public.document_chunks enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "Authenticated users can view knowledge documents" on public.documents;
create policy "Authenticated users can view knowledge documents"
on public.documents
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can view knowledge chunks" on public.document_chunks;
create policy "Authenticated users can view knowledge chunks"
on public.document_chunks
for select
to authenticated
using (true);

drop policy if exists "Users can view own chat sessions" on public.chat_sessions;
create policy "Users can view own chat sessions"
on public.chat_sessions
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own chat sessions" on public.chat_sessions;
create policy "Users can insert own chat sessions"
on public.chat_sessions
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own chat sessions" on public.chat_sessions;
create policy "Users can update own chat sessions"
on public.chat_sessions
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can view own chat messages" on public.chat_messages;
create policy "Users can view own chat messages"
on public.chat_messages
for select
to authenticated
using (
  auth.uid() = user_id
  and exists (
    select 1
    from public.chat_sessions cs
    where cs.id = session_id
      and cs.user_id = auth.uid()
  )
);

drop policy if exists "Users can insert own chat messages" on public.chat_messages;
create policy "Users can insert own chat messages"
on public.chat_messages
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.chat_sessions cs
    where cs.id = session_id
      and cs.user_id = auth.uid()
  )
);
