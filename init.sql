-- CREAR BASE DE DATOS
CREATE DATABASE IF NOT EXISTS patitas_felices
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE patitas_felices;

-- USUARIOS
-- Roles:
-- 1: ADMIN → administra todo
-- 2: USER → dueño de mascotas
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    rol_id INT NOT NULL DEFAULT 2,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MASCOTAS
-- Cada mascota pertenece a un usuario
CREATE TABLE mascotas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE,
    usuario_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_mascota_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

-- VETERINARIOS
-- Solo ADMIN puede crear veterinarios (logica backend)
CREATE TABLE veterinarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    matricula VARCHAR(50) NOT NULL UNIQUE,
    especialidad VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- HISTORIALES CLÍNICOS
-- Relaciona mascota, veterinario, descripcion
CREATE TABLE historiales_clinicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_mascota INT NOT NULL,
    id_veterinario INT NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_historial_mascota
        FOREIGN KEY (id_mascota)
        REFERENCES mascotas(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_historial_veterinario
        FOREIGN KEY (id_veterinario)
        REFERENCES veterinarios(id)
        ON DELETE RESTRICT
);

-- INDEXES (performance)
CREATE INDEX idx_mascotas_usuario ON mascotas(usuario_id);
CREATE INDEX idx_historial_mascota ON historiales_clinicos(id_mascota);
CREATE INDEX idx_historial_veterinario ON historiales_clinicos(id_veterinario);

-- DATOS DE EJEMPLO
-- Insertar veterinario de ejemplo
INSERT INTO veterinarios (nombre, apellido, matricula, especialidad) VALUES
('Dr. Juan', 'Pérez', 'MAT-001', 'Medicina General');

-- Nota: Para insertar historiales, primero registra un usuario y una mascota, luego inserta manualmente o desde admin.
