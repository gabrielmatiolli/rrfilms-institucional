-- CreateTable
CREATE TABLE `PedidoDeOrcamento` (
    `id` VARCHAR(191) NOT NULL,
    `origem` ENUM('CONTATO', 'EMPRESAS') NOT NULL,
    `status` ENUM('NOVO', 'EM_ATENDIMENTO', 'FECHADO', 'DESCARTADO') NOT NULL DEFAULT 'NOVO',
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `whatsapp` VARCHAR(191) NOT NULL,
    `detalhe` VARCHAR(191) NULL,
    `mensagem` TEXT NULL,
    `aceitaWhatsapp` BOOLEAN NOT NULL,
    `ip` VARCHAR(191) NOT NULL,
    `emailEnviado` BOOLEAN NOT NULL DEFAULT false,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL,

    INDEX `PedidoDeOrcamento_status_criadoEm_idx`(`status`, `criadoEm`),
    INDEX `PedidoDeOrcamento_ip_criadoEm_idx`(`ip`, `criadoEm`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
