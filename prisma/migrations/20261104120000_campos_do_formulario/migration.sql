-- Campos novos dos formulários de orçamento (revisão de copy de 28/10/2026):
-- cidade e "para onde é a película" passam a ser obrigatórios no site, e o
-- e-mail deixa de ser — o retorno combinado com o cliente é por WhatsApp.
--
-- Escrita à mão, e não por `prisma migrate dev`: o banco de dev desta máquina
-- aponta para produção (ver README, "Banco de dados"). Sobe com
-- `npm run db:deploy`.

-- AlterTable
ALTER TABLE `PedidoDeOrcamento`
    ADD COLUMN `empresa` VARCHAR(191) NULL,
    ADD COLUMN `cidade` VARCHAR(191) NULL,
    ADD COLUMN `publico` VARCHAR(191) NULL,
    ADD COLUMN `interesse` VARCHAR(191) NULL,
    MODIFY COLUMN `email` VARCHAR(191) NULL;
