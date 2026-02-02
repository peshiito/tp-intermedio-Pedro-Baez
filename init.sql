CREATE DATABASE IF NOT EXISTS Veterinaria_patitas_felices;
USE Veterinaria_patitas_felices;

CREATE TABLE duenos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion VARCHAR(100)
);

CREATE TABLE mascotas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    especie VARCHAR(30) NOT NULL,
    fecha_nacimiento DATE,
    id_dueno INT, 
    CONSTRAINT fk_dueno_mascota FOREIGN KEY (id_dueno) 
        REFERENCES duenos(id) ON DELETE CASCADE
);

CREATE TABLE veterinarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    matricula VARCHAR(20) UNIQUE NOT NULL,
    especialidad VARCHAR(50) NOT NULL
);

CREATE TABLE historial_clinico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_mascota INT NOT NULL,
    id_veterinario INT NOT NULL,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    descripcion VARCHAR(250) NOT NULL,
    CONSTRAINT fk_mascota_historial FOREIGN KEY (id_mascota) 
        REFERENCES mascotas(id) ON DELETE CASCADE,
    CONSTRAINT fk_veterinario_historial FOREIGN KEY (id_veterinario) 
        REFERENCES veterinarios(id)
);