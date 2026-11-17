-- Senha comum do site: nova sessão do tipo 'site' (vale 8 horas).
alter table sessions drop constraint if exists sessions_kind_check;
alter table sessions add constraint sessions_kind_check check (kind in ('admin', 'equipe', 'site'));
