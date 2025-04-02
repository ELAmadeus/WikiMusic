const db = require("aa-sqlite");

async function CrearBaseSiNoExiste() {
  try {
    // Abrir base, si no existe el archivo/base lo crea
    await db.open("./.data/musica.db");

    // Función para crear tabla si no existe
    const crearTablaSiNoExiste = async (nombreTabla, sqlCrear, sqlInsertar) => {
      let existe = false;
      let res = await db.get(
        "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name = ?",
        [nombreTabla]
      );


      // Si la tabla ya existe, no se crea
      if (res.contar > 0) existe = true;

      if (!existe) {
        await db.run(sqlCrear);
        console.log(`Tabla ${nombreTabla} creada!`);
        await db.run(sqlInsertar);
      } else {
        console.log(`La tabla ${nombreTabla} ya existe.`);
      }
    };

    // Crear la tabla biografias
    await crearTablaSiNoExiste(
      'Biografias',
    `CREATE TABLE Biografias (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        Historia TEXT NOT NULL,
        ArtistaId INTEGER NOT NULL,
        Wikipedia TEXT,
        FOREIGN KEY (ArtistaId) REFERENCES artistas(IdArtista) ON DELETE CASCADE
      );`,
      `INSERT INTO Biografias (Historia, ArtistaId, Wikipedia) VALUES
      ('Shakira ha vendido más de 75 millones de discos y es conocida por su estilo único que mezcla pop y rock.', 1, 'https://es.wikipedia.org/wiki/Shakira'),
      ('Luis Miguel ha ganado múltiples premios Grammy y es conocido por su potente voz en baladas románticas.', 2, 'https://es.wikipedia.org/wiki/Luis_Miguel') ,
      ('Gloria Estefan ha influido en la música pop latina y ha vendido más de 100 millones de discos en todo el mundo.', 3, 'https://es.wikipedia.org/wiki/Gloria_Estefan'),
      ('Juanes ha sido un defensor de los derechos humanos y ha usado su música para promover la paz en Colombia.', 4, 'https://es.wikipedia.org/wiki/Juanes'),
      ('Celia Cruz fue pionera en llevar la salsa al mundo, convirtiéndose en un símbolo de la música latina.', 5, 'https://es.wikipedia.org/wiki/Celia_Cruz'),
      ('Ricky Martin ha sido un ícono del pop latino y es conocido por su trabajo en la televisión y el teatro musical.', 6, 'https://es.wikipedia.org/wiki/Ricky_Martin'),
      ('Marc Anthony ha obtenido múltiples premios por su música salsa y baladas, siendo uno de los artistas más influyentes.', 7, 'https://es.wikipedia.org/wiki/Marc_Anthony'),
      ('Jennifer Lopez, también conocida como J.Lo, ha hecho historia como cantante, actriz y empresaria en Hollywood.', 8, 'https://es.wikipedia.org/wiki/Jennifer_Lopez'),
      ('Carlos Vives ha revitalizado el vallenato y ha fusionado estilos tradicionales con música moderna.', 9, 'https://es.wikipedia.org/wiki/Carlos_Vives'),
      ('Enrique Iglesias es conocido como el "Rey del Pop Latino" y ha vendido millones de discos a nivel mundial.', 10, 'https://es.wikipedia.org/wiki/Enrique_Iglesias');`
    );

    // Crear la tabla Sellos
    await crearTablaSiNoExiste(
      'Sellos',
      `CREATE TABLE Sellos (
        IdSello INTEGER PRIMARY KEY AUTOINCREMENT,
        Nombre TEXT NOT NULL UNIQUE,
        Pais TEXT NOT NULL,
        FechaFundacion TEXT NOT NULL,
        ArtistasFirmados INTEGER NOT NULL        
      );`,
      `INSERT INTO Sellos (Nombre, Pais, FechaFundacion, ArtistasFirmados) VALUES
      ('Sony Music', 'Estados Unidos', '1929-01-01', 300),
      ('Universal Music Group', 'Estados Unidos', '1934-03-09', 500),
      ('Warner Music Group', 'Estados Unidos', '1958-02-10', 250),
      ('EMI Records', 'Reino Unido', '1972-04-14', 200),
      ('Island Records', 'Reino Unido', '1959-05-22', 150),
      ('Columbia Records', 'Estados Unidos', '1887-10-17', 350),
      ('Atlantic Records', 'Estados Unidos', '1947-09-14', 180),
      ('Virgin Records', 'Reino Unido', '1972-11-15', 220),
      ('Def Jam Recordings', 'Estados Unidos', '1984-05-10', 100),
      ('Motown', 'Estados Unidos', '1959-01-12', 120);`
    );

    // Crear la tabla Artistas
    await crearTablaSiNoExiste(
      "Artistas",
      `CREATE TABLE Artistas (
        IdArtista INTEGER PRIMARY KEY AUTOINCREMENT,
        Nombre TEXT NOT NULL UNIQUE,
        Nacionalidad TEXT,
        AñosActivos INTEGER,
        FechaInicio TEXT,
        SelloId INTEGER,
        FOREIGN KEY (SelloId) REFERENCES sellos(IdSello) ON DELETE SET NULL
      );`,
      `INSERT INTO Artistas (Nombre, Nacionalidad, AñosActivos, FechaInicio, SelloId) VALUES
      ('Shakira', 'Colombia', 30, '1990-01-01', 3),
      ('Luis Miguel', 'México', 40, '1982-01-01', 2),
      ('Gloria Estefan', 'Estados Unidos', 45, '1978-01-01', 3),
      ('Juanes', 'Colombia', 25, '1998-01-01', 4),
      ('Celia Cruz', 'Cuba', 50, '1950-01-01', 5),
      ('Ricky Martin', 'Puerto Rico', 35, '1984-01-01', 6),
      ('Marc Anthony', 'Estados Unidos', 30, '1993-01-01', 7),
      ('Jennifer Lopez', 'Estados Unidos', 25, '1997-01-01', 8),
      ('Carlos Vives', 'Colombia', 35, '1985-01-01', 9),
      ('Enrique Iglesias', 'España', 26, '1995-01-01', 10);`
    );

    // Crear la tabla Generos
    await crearTablaSiNoExiste(
      'Generos',
      `CREATE TABLE Generos (
        IdGenero INTEGER PRIMARY KEY AUTOINCREMENT,
        Nombre TEXT NOT NULL UNIQUE,
        Descripcion TEXT NOT NULL,
        Popularidad INTEGER NOT NULL,
        FechaCreacion TEXT NOT NULL
      );`,
      `INSERT INTO Generos (Nombre, Descripcion, Popularidad, FechaCreacion) VALUES
      ('Rock', 'Género de rock clásico y moderno', 85, '2024-01-01'),
      ('Pop', 'Género de música pop internacional', 90, '2024-01-01'),
      ('Jazz', 'Género de jazz tradicional y contemporáneo', 70, '2024-01-01'),
      ('Blues', 'Género de blues tradicional y moderno', 65, '2024-01-01'),
      ('Reggae', 'Género de música reggae', 75, '2024-01-01'),
      ('Hip Hop', 'Género de hip hop y rap', 80, '2024-01-01'),
      ('Clásica', 'Música clásica y sinfónica', 60, '2024-01-01'),
      ('Electrónica', 'Género de música electrónica', 88, '2024-01-01'),
      ('Salsa', 'Género de música salsa y tropical', 77, '2024-01-01'),
      ('Country', 'Género de música country', 55, '2024-01-01');`
    );

    // Crear la tabla Albumes
    await crearTablaSiNoExiste(
      "Albumes",
      `CREATE TABLE Albumes (
        IdAlbum INTEGER PRIMARY KEY AUTOINCREMENT,
        Titulo TEXT NOT NULL,
        ArtistaId INTEGER NOT NULL,
        GeneroId INTEGER ,
        FechaLanzamiento TEXT,
        CantidadCanciones INTEGER,
        FOREIGN KEY (ArtistaId) REFERENCES artistas(IdArtista) ON DELETE CASCADE,
        FOREIGN KEY (GeneroId) REFERENCES generos(IdGenero) ON DELETE SET NULL
      );`,
      `INSERT INTO Albumes (Titulo, ArtistaId, GeneroId, FechaLanzamiento, CantidadCanciones) VALUES
      ('Laundry Service', 2, 3, '2001-11-13', 14),
      ('Romance', 2, 2, '1991-09-10', 10),
      ('Cuts Both Ways', 3, 3, '1989-03-10', 11),
      ('Unplugged', 4, 4, '2004-04-26', 10),
      ('La Negra Tiene Tumbao', 5, 5, '2005-01-01', 12),
      ('Vuelve', 6, 6, '1998-05-03', 13),
      ('3.0', 7, 7, '2014-01-14', 11),
      ('J.Lo', 8, 8, '2001-06-25', 12),
      ('La Tierra del Olvido', 9, 9, '1999-07-19', 14),
      ('Euphoria', 10, 10, '2010-07-12', 10);`
    );

    // Crear la tabla Canciones
await crearTablaSiNoExiste(
  'Canciones',
  `CREATE TABLE Canciones (
    IdCancion INTEGER PRIMARY KEY AUTOINCREMENT,
    Titulo TEXT NOT NULL,
    Duracion TEXT NOT NULL,
    AlbumId INTEGER,
    FOREIGN KEY (AlbumId) REFERENCES albumes(IdAlbum) ON DELETE CASCADE
  );`,
  `INSERT INTO Canciones (Titulo, Duracion, AlbumId) VALUES
  ('Hips Dont Lie', '3:32', 2),
  ('Bésame Mucho', '4:10', 3),
  ('Amiga', '4:00', 4),
  ('La Gota Fría', '3:45', 5),
  ('A Dios le Pido', '3:40', 2),
  ('Livin la Vida Loca', '4:03', 6),
  ('Lets Get Loud', '3:58', 7),
  ('Conga', '4:14', 8),
  ('Torero', '3:37', 9),
  ('I Like It', '3:51', 10);`
);


// Crear la tabla Conciertos
    await crearTablaSiNoExiste(
      'Conciertos',
      `CREATE TABLE Conciertos (
        IdConcierto INTEGER PRIMARY KEY AUTOINCREMENT,
        Nombre TEXT NOT NULL UNIQUE,
        Fecha TEXT NOT NULL,
        Lugar TEXT NOT NULL,
        ArtistaId INTEGER NOT NULL,
        DuracionMinutos INTEGER NOT NULL,
        FOREIGN KEY (ArtistaId) REFERENCES artistas(IdArtista) ON DELETE CASCADE
      );`,
      `INSERT INTO Conciertos (Nombre, Fecha, Lugar, ArtistaId, DuracionMinutos) VALUES
      ('Concierto de Shakira', '2024-01-15', 'Bogotá', 2, 120),
      ('Festival Latino', '2024-03-22', 'Miami', 6, 180),
      ('Noche de Boleros', '2024-05-05', 'Ciudad de México', 3, 90),
      ('Sirope en Vivo', '2024-07-18', 'Madrid', 4, 150),
      ('Carnaval de Celia', '2024-08-12', 'La Habana', 5, 110),
      ('Ritmos del Caribe', '2024-09-10', 'San Juan', 9, 100),
      ('Tour Euphoria', '2024-10-15', 'Barcelona', 10, 140),
      ('Gira de Juanes', '2024-11-05', 'Buenos Aires', 2, 130),
      ('Jennifer en Concierto', '2024-12-08', 'Los Ángeles', 7, 125),
      ('Gloria Estefan Live', '2025-01-20', 'Miami', 8, 135);`
    );

// Crear la tabla Premios
    await crearTablaSiNoExiste(
      'Premios',
      `CREATE TABLE Premios (
        IdPremio INTEGER PRIMARY KEY AUTOINCREMENT,
        Nombre TEXT NOT NULL UNIQUE,
        Descripcion TEXT NOT NULL,
        FechaEntrega TEXT NOT NULL,
        ArtistaId INTEGER NOT NULL,
        FOREIGN KEY (ArtistaId) REFERENCES artistas(IdArtista) ON DELETE CASCADE       
      );`,
      `INSERT INTO Premios (Nombre, Descripcion, FechaEntrega, ArtistaId ) VALUES
      ('Grammy al Mejor Álbum del Año', 'Premio otorgado al mejor álbum del año según la Academia Nacional de Artes y Ciencias de la Grabación.', '2023-02-05', 1),
      ('Latin Grammy a la Canción del Año', 'Reconocimiento a la mejor canción en español o portugués otorgado por la Academia Latina de la Grabación.', '2023-11-16', 2),
      ('MTV Video Music Award', 'Premio otorgado al mejor video musical por MTV.', '2023-09-12', 3),
      ('Billboard Music Award', 'Premio otorgado basado en el rendimiento en listas de éxitos según Billboard.', '2023-05-14', 4),
      ('American Music Award', 'Premio otorgado en base a la popularidad y votaciones de los fans.', '2023-11-19', 5),
      ('Premio Lo Nuestro', 'Reconocimiento a la excelencia musical latina otorgado por Univision.', '2023-02-23', 6),
      ('Premio Oye', 'Premio otorgado en México a lo mejor de la música.', '2023-06-15', 7),
      ('Premio ASCAP', 'Premio otorgado por la Sociedad Americana de Compositores, Autores y Editores.', '2023-03-22', 8),
      ('iHeartRadio Music Award', 'Premio que reconoce a los artistas más escuchados en iHeartRadio.', '2023-03-27', 9),
      ('Golden Disc Award', 'Reconocimiento coreano a los mejores álbumes y canciones en ventas y popularidad.', '2023-01-07', 10);`
    );

// Tabla Usuarios
await crearTablaSiNoExiste(
  'Usuarios',
  `CREATE TABLE Usuarios (
    Username TEXT PRIMARY KEY,
    Password TEXT NOT NULL,
    Rol TEXT NOT NULL DEFAULT 'member' -- Agregar columna Rol con valor predeterminado
  );`
);



  } catch (error) {
    console.error("Error al crear la base de datos:", error);
  } finally {
    // Cerrar la base
    await db.close();
  }
};

CrearBaseSiNoExiste();

module.exports = CrearBaseSiNoExiste;