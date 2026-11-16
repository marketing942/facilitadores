-- Facilitadores CPPEM: tabelas editáveis pelo painel /admin.
-- Segurança: RLS ligado em TODAS as tabelas e nenhuma policy criada. Assim a chave pública
-- (publishable/anon) do Supabase não lê nem grava nada. Só o servidor do sistema acessa o banco,
-- usando a conexão direta com o Postgres (variável DATABASE_URL).

create extension if not exists pgcrypto;

-- Configurações em chave/valor (dados da empresa, Wi-Fi de visitantes, hashes de senha)
create table if not exists settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Sessões do painel (kind = 'admin') e da senha da equipe (kind = 'equipe'). Guarda só o hash do token.
create table if not exists sessions (
  token_hash text primary key,
  kind text not null check (kind in ('admin', 'equipe')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists sessions_expires_idx on sessions (expires_at);

-- Tentativas de login com erro, para bloquear força bruta
create table if not exists login_attempts (
  id bigserial primary key,
  kind text not null,
  ip text not null,
  created_at timestamptz not null default now()
);
create index if not exists login_attempts_idx on login_attempts (kind, ip, created_at);

create table if not exists atendimento_links (
  id uuid primary key default gen_random_uuid(),
  bu text not null check (bu in ('CPPEM', 'Colégio', 'Unicive')),
  kind text not null check (kind in ('Atendimento', 'Suporte')),
  channel text not null check (channel in ('Humano', 'IA')),
  url text not null,
  photo text not null default '',
  position int not null default 0,
  ativo boolean not null default true
);

create table if not exists telefones (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  exibicao text not null,
  digitos text not null,
  whatsapp text,
  position int not null default 0
);

create table if not exists redes_bus (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nome text not null,
  descricao text not null default '',
  site_label text,
  site_url text,
  position int not null default 0
);

create table if not exists redes (
  id uuid primary key default gen_random_uuid(),
  bu_id uuid not null references redes_bus (id) on delete cascade,
  key text not null check (key in ('instagram', 'youtube', 'tiktok', 'threads', 'facebook', 'x', 'linkedin', 'whatsapp')),
  label text not null,
  perfil text not null default '',
  url text not null,
  position int not null default 0
);
create index if not exists redes_bu_idx on redes (bu_id);

create table if not exists ferramentas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text not null default '',
  url text not null,
  tags text[] not null default '{}',
  position int not null default 0
);

-- Redes Wi-Fi internas. As senhas só saem do banco para quem digitou a senha da equipe.
create table if not exists wifi_redes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  senha text not null,
  position int not null default 0
);

create table if not exists livros (
  slug text primary key,
  titulo text not null,
  autor text not null default '',
  categorias text[] not null default '{}',
  objetivos text[] not null default '{}',
  publico text[] not null default '{}',
  notion text not null default '',
  compra text not null default '',
  preenchido boolean not null default false,
  capa text,
  position int not null default 0
);

create table if not exists trilhas (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('g4', 'interna')),
  slug text not null,
  nome text not null,
  area text not null,
  position int not null default 0,
  unique (tipo, slug)
);

create table if not exists trilha_cursos (
  id uuid primary key default gen_random_uuid(),
  trilha_id uuid not null references trilhas (id) on delete cascade,
  titulo text not null,
  emoji text,
  url text not null,
  descricao text,
  formatos text[] not null default '{}',
  position int not null default 0
);
create index if not exists trilha_cursos_idx on trilha_cursos (trilha_id);

do $$
declare t text;
begin
  foreach t in array array['settings','sessions','login_attempts','atendimento_links','telefones','redes_bus','redes','ferramentas','wifi_redes','livros','trilhas','trilha_cursos']
  loop
    execute format('alter table %I enable row level security', t);
  end loop;
end $$;
