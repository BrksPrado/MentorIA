-- Inserir usuário padrão
INSERT INTO tb_usuario (id, username, email, password)
VALUES (UUID(), 'admin', 'admin@email.com', 'admin7');



-- Inserir matérias de exemplo
INSERT INTO tb_materia (id, nome, identificador) VALUES
(UUID(), 'Matemática', 1);