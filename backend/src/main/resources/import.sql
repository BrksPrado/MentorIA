-- Inserir usuário padrão
INSERT INTO tb_usuario (id, username, email, password) VALUES
(UUID_TO_BIN('b760b8b4-0581-4d05-aac6-d3df00f39ef5'), 'vitorio', 'vitorio@example.com', '123123');

INSERT INTO tb_usuario (id, username, email, password) VALUES
    (UUID_TO_BIN('b760b8b4-0581-4d05-aac6-d3df00f39ef6'), 'adeministro', 'adiminastro@outlook.com', 'zedofrangotudojunto');



-- Inserir múltiplos simulados no histórico
INSERT INTO tb_simulado (id, usuario_id, materia_id, pontuacao, dataHora, observacoes, acertos, totalQuestoes) VALUES
-- Simulado 1: ENEM 2024 - Completo (38 questões)
(UUID_TO_BIN('68f95563-86f3-4076-b5f6-edc6af42e235'), UUID_TO_BIN('b760b8b4-0581-4d05-aac6-d3df00f39ef5'), NULL, 78.9, '2025-10-29 15:20:29.588', 'ENEM 2024 - Completo', 30, 38),
(UUID_TO_BIN('68f95563-86f3-4076-b5f6-edc6af42e236'), UUID_TO_BIN('b760b8b4-0581-4d05-aac6-d3df00f39ef6'), NULL, 09.0, '2025-10-29 15:20:29.588', 'ENEM 2024 - Completo', 09, 100),

-- Simulado 2: ENEM 2023 - Matemática (40 questões)
(UUID_TO_BIN('a1f95563-86f3-4076-b5f6-edc6af42e236'), UUID_TO_BIN('b760b8b4-0581-4d05-aac6-d3df00f39ef5'), NULL, 99, '2025-10-28 14:10:15.000', 'ENEM 2023 - Matemática', 99, 100),

-- Simulado 3: ENEM 2022 - Ciências da Natureza (40 questões)
(UUID_TO_BIN('b2f95563-86f3-4076-b5f6-edc6af42e237'), UUID_TO_BIN('b760b8b4-0581-4d05-aac6-d3df00f39ef5'), NULL, 82.5, '2025-10-27 11:45:30.000', 'ENEM 2022 - Ciências da Natureza', 33, 40),

-- Simulado 4: ENEM 2021 - Linguagens (40 questões)
(UUID_TO_BIN('c3f95563-86f3-4076-b5f6-edc6af42e238'), UUID_TO_BIN('b760b8b4-0581-4d05-aac6-d3df00f39ef5'), NULL, 75.0, '2025-10-26 10:20:45.000', 'ENEM 2021 - Linguagens', 30, 40),

-- Simulado 5: ENEM 2024 - Ciências Humanas (40 questões)
(UUID_TO_BIN('d4f95563-86f3-4076-b5f6-edc6af42e239'), UUID_TO_BIN('b760b8b4-0581-4d05-aac6-d3df00f39ef5'), NULL, 92.5, '2025-10-25 09:15:20.000', 'ENEM 2024 - Ciências Humanas', 37, 40),

-- Simulado 6: Simulado Generativo (50 questões)
(UUID_TO_BIN('e5f95563-86f3-4076-b5f6-edc6af42e240'), UUID_TO_BIN('b760b8b4-0581-4d05-aac6-d3df00f39ef5'), NULL, 72.0, '2010-10-24 16:30:00.000', 'Simulado de Física Quântica', 36, 50);