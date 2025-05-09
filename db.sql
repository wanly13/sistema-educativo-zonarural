USE sistema_educativo_zonarural;

// -------------------- USUARIOS
CREATE TABLE Profesores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    cantidad_logeos INT DEFAULT 0,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    clave VARCHAR(100) NOT NULL
);

CREATE TABLE Alumnos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    cantidad_logeos INT DEFAULT 0,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    clave VARCHAR(100) NOT NULL
);


// -------------------- CURSOS Y TEMAS
CREATE TABLE Cursos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    docente_id INT NOT NULL,
    FOREIGN KEY (docente_id) REFERENCES docentes(id)
);

CREATE TABLE Temas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    curso_id INT NOT NULL,
    FOREIGN KEY (curso_id) REFERENCES cursos(id)
);

// -------------------- ARCHIVOS PDFS Y VIDEOS
CREATE TABLE Archivos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('pdf', 'video') NOT NULL,
    url VARCHAR(255) NOT NULL,
    tema_id INT NOT NULL,
    FOREIGN KEY (tema_id) REFERENCES temas(id)
);