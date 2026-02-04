CREATE DATABASE IF NOT EXISTS patitas_felices
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE patitas_felices;


CREATE TABLE roles (
    id INT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO roles VALUES 
(1, 'ADMIN'),
(2, 'CLIENTE'),
(3, 'VETERINARIO');


CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    rol_id INT NOT NULL DEFAULT 2,
    
    -- SOLO PARA VETERINARIOS (nullable)
    matricula VARCHAR(50) UNIQUE NULL,
    especialidad VARCHAR(100) NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (rol_id)
        REFERENCES roles(id)
);


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


CREATE TABLE historiales_medicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mascota_id INT NOT NULL,
    veterinario_id INT NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_historial_mascota
        FOREIGN KEY (mascota_id)
        REFERENCES mascotas(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_historial_veterinario
        FOREIGN KEY (veterinario_id)
        REFERENCES usuarios(id)
        ON DELETE RESTRICT
);


CREATE INDEX idx_mascotas_usuario ON mascotas(usuario_id);
CREATE INDEX idx_historial_mascota ON historiales_medicos(mascota_id);
CREATE INDEX idx_historial_veterinario ON historiales_medicos(veterinario_id);
