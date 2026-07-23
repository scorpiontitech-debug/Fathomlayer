-- Adiciona a coluna github_repo na tabela de software para trazer dados vitais da comunidade
ALTER TABLE software ADD COLUMN github_repo text;
