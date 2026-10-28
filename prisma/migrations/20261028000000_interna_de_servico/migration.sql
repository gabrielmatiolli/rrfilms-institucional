-- A interna do serviço: /servicos/<slug>, com o corpo montado no editor de
-- blocos do painel. Mesma estrutura já usada em `Produto`.

-- `conteudo` entra como NULL para as linhas que já existem poderem ser
-- preenchidas com uma lista vazia antes de a coluna virar NOT NULL: em JSON o
-- MySQL não tem default implícito e o ALTER direto falharia na tabela com dados.
ALTER TABLE `Servico`
    ADD COLUMN `temPaginaPropria` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `conteudo` JSON NULL,
    ADD COLUMN `metaTitulo` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `metaDescricao` VARCHAR(320) NOT NULL DEFAULT '';

UPDATE `Servico` SET `conteudo` = '[]' WHERE `conteudo` IS NULL;

ALTER TABLE `Servico` MODIFY COLUMN `conteudo` JSON NOT NULL;
