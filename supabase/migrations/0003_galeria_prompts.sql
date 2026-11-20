-- Galeria de Prompts (Comercial): prompts em Markdown, etiquetas e a ligação entre eles.
-- Um prompt pode ter várias etiquetas (prompt_etiquetas é muitos-para-muitos).
-- RLS ligado e sem policies, como nas demais tabelas: só o servidor do sistema acessa.

create table if not exists etiquetas (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists prompts (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  conteudo text not null,
  ativo boolean not null default true,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists prompt_etiquetas (
  prompt_id uuid not null references prompts(id) on delete cascade,
  etiqueta_id uuid not null references etiquetas(id) on delete cascade,
  primary key (prompt_id, etiqueta_id)
);
create index if not exists prompt_etiquetas_etiqueta_idx on prompt_etiquetas (etiqueta_id);

alter table etiquetas enable row level security;
alter table prompts enable row level security;
alter table prompt_etiquetas enable row level security;

insert into etiquetas (nome, position) values ('Follow-up', 1), ('Pipeline', 2), ('Atendimento', 3)
on conflict (nome) do nothing;
