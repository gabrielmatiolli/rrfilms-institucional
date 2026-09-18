-- CreateTable
CREATE TABLE `AdminUser` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `papel` ENUM('DONO', 'EDITOR') NOT NULL DEFAULT 'EDITOR',
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `tentativasFalhas` INTEGER NOT NULL DEFAULT 0,
    `bloqueadoAte` DATETIME(3) NULL,
    `ultimoLoginEm` DATETIME(3) NULL,
    `ultimoLoginIp` VARCHAR(191) NULL,
    `versaoSessao` INTEGER NOT NULL DEFAULT 0,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AdminUser_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoginAttempt` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `ip` VARCHAR(191) NOT NULL,
    `userAgent` TEXT NULL,
    `sucesso` BOOLEAN NOT NULL,
    `motivo` ENUM('SUCESSO', 'CREDENCIAIS_INVALIDAS', 'CONTA_BLOQUEADA', 'CONTA_INATIVA', 'IP_BLOQUEADO', 'CAPTCHA_FALHOU') NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `LoginAttempt_email_sucesso_criadoEm_idx`(`email`, `sucesso`, `criadoEm`),
    INDEX `LoginAttempt_ip_sucesso_criadoEm_idx`(`ip`, `sucesso`, `criadoEm`),
    INDEX `LoginAttempt_criadoEm_idx`(`criadoEm`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActivityLog` (
    `id` VARCHAR(191) NOT NULL,
    `mensagem` TEXT NOT NULL,
    `autor` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ActivityLog_criadoEm_idx`(`criadoEm`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlogCategoria` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `rotulo` VARCHAR(191) NOT NULL,
    `icone` VARCHAR(191) NOT NULL DEFAULT 'janela',
    `ordem` INTEGER NOT NULL DEFAULT 0,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BlogCategoria_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlogPost` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `resumo` TEXT NOT NULL,
    `conteudo` JSON NOT NULL,
    `capa` VARCHAR(191) NOT NULL,
    `autor` VARCHAR(191) NOT NULL DEFAULT 'Equipe RR Film',
    `categoriaId` VARCHAR(191) NULL,
    `minutosLeitura` INTEGER NOT NULL DEFAULT 5,
    `status` ENUM('PUBLICADO', 'RASCUNHO') NOT NULL DEFAULT 'RASCUNHO',
    `destaque` BOOLEAN NOT NULL DEFAULT false,
    `publicadoEm` DATETIME(3) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BlogPost_slug_key`(`slug`),
    INDEX `BlogPost_status_publicadoEm_idx`(`status`, `publicadoEm`),
    INDEX `BlogPost_categoriaId_idx`(`categoriaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Servico` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `linha` ENUM('CONFORTO', 'LUZ', 'FRESCOR') NOT NULL DEFAULT 'CONFORTO',
    `tag` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `descricao` TEXT NOT NULL,
    `foto` VARCHAR(191) NOT NULL,
    `dados` JSON NOT NULL,
    `href` VARCHAR(191) NOT NULL DEFAULT '/contato',
    `ordem` INTEGER NOT NULL DEFAULT 0,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Servico_slug_key`(`slug`),
    INDEX `Servico_ativo_ordem_idx`(`ativo`, `ordem`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produto` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `destaque` VARCHAR(191) NOT NULL,
    `promessa` TEXT NOT NULL,
    `descricao` TEXT NOT NULL,
    `foto` VARCHAR(191) NOT NULL DEFAULT '',
    `ordem` INTEGER NOT NULL DEFAULT 0,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `temPaginaPropria` BOOLEAN NOT NULL DEFAULT false,
    `hrefExterno` VARCHAR(191) NOT NULL DEFAULT '/contato',
    `conteudo` JSON NOT NULL,
    `metaTitulo` VARCHAR(191) NOT NULL DEFAULT '',
    `metaDescricao` VARCHAR(320) NOT NULL DEFAULT '',
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Produto_slug_key`(`slug`),
    INDEX `Produto_ativo_ordem_idx`(`ativo`, `ordem`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Galeria` (
    `id` VARCHAR(191) NOT NULL,
    `chave` VARCHAR(191) NOT NULL,
    `nomeNoPainel` VARCHAR(191) NOT NULL,
    `sobrancelha` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `lead` TEXT NOT NULL,
    `ordem` INTEGER NOT NULL DEFAULT 0,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Galeria_chave_key`(`chave`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GaleriaItem` (
    `id` VARCHAR(191) NOT NULL,
    `galeriaId` VARCHAR(191) NOT NULL,
    `imagem` VARCHAR(191) NOT NULL,
    `alt` VARCHAR(191) NOT NULL,
    `ordem` INTEGER NOT NULL DEFAULT 0,

    INDEX `GaleriaItem_galeriaId_ordem_idx`(`galeriaId`, `ordem`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Depoimento` (
    `id` VARCHAR(191) NOT NULL,
    `citacao` TEXT NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `contexto` VARCHAR(191) NOT NULL,
    `ordem` INTEGER NOT NULL DEFAULT 0,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `autorizado` BOOLEAN NOT NULL DEFAULT false,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL,

    INDEX `Depoimento_ativo_ordem_idx`(`ativo`, `ordem`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConfiguracaoSite` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'singleton',
    `telefone` VARCHAR(191) NOT NULL,
    `telefoneLink` VARCHAR(191) NOT NULL,
    `whatsapp` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `instagram` VARCHAR(191) NOT NULL,
    `instagramUrl` VARCHAR(191) NOT NULL,
    `horario` VARCHAR(191) NOT NULL,
    `atendimento` VARCHAR(191) NOT NULL,
    `cidade` VARCHAR(191) NOT NULL,
    `cnpj` VARCHAR(191) NOT NULL,
    `atualizadoEm` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BlogPost` ADD CONSTRAINT `BlogPost_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `BlogCategoria`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GaleriaItem` ADD CONSTRAINT `GaleriaItem_galeriaId_fkey` FOREIGN KEY (`galeriaId`) REFERENCES `Galeria`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
