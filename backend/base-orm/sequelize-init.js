const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite:" + "./.data/musica.db");



// Definición del modelo de sellos
const sellos = sequelize.define(
    "sellos",
    {
        IdSello: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: "El nombre del sello ya existe"
            }
        },
        Pais: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        FechaFundacion: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        ArtistasFirmados: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: {
                    args: [0],
                    msg: "Artistas Firmados no puede ser un número negativo",
                },
            },
        }
    }, {
       timestamps: false,
    }
);

// Definición del modelo de Artista
const artistas = sequelize.define(
    "artistas",
    {
        IdArtista: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Nombre es requerido",
                },
                len: {
                    args: [3, 100],
                    msg: "Nombre debe ser entre 3 y 100 caracteres",
                },
            },
            unique: {
                args: true,
                msg: "Este nombre ya existe en la tabla!",
            },
        },
        Nacionalidad: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        AñosActivos: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        FechaInicio: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        SelloId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'sellos',
                key: 'IdSello',
            },
        },
    },
    {
        timestamps: false,
    }
);

artistas.belongsTo(sellos, {
    foreignKey: 'SelloId',    
    onDelete: "SET NULL",
    onUpdate: "SET NULL",
    as: 'sello'
  });

// Definición del modelo de biografias
const biografias = sequelize.define(
    "biografias",
    {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Historia: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Historia es requerida",
                },
            },
        },
        ArtistaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            /*unique: {
                args: true,
                msg: "Ya existe una biografia para este artista"
            },*/
            references: {
                model: 'artistas', // Asegúrate de que el nombre del modelo sea correcto
                key: 'IdArtista',
            },
        },
        Wikipedia: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Wikipedia es requerida",
                },
            },
        },
    },
    {
        timestamps: false,
    }
);

biografias.belongsTo(artistas, {
    foreignKey: 'ArtistaId',
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    as: 'artista'
  });
  
// Definición del modelo de generos
const generos = sequelize.define(
    "generos",
    {
        IdGenero: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: "El nombre del género ya existe"
            }
        },
        Descripcion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Popularidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        FechaCreacion: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        }
    }, {
       timestamps: false,
    }
);

// Definición del modelo de albumes
const albumes = sequelize.define(
    "albumes",
    {
        IdAlbum: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Titulo: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Título es requerido",
                },
                len: {
                    args: [3, 100],
                    msg: "Título debe ser entre 3 y 100 caracteres",
                },
            },
        },
        ArtistaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'artistas',
                key: 'IdArtista',
            },
        },
        GeneroId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'generos',
                key: 'IdGenero',
            },
        },
        FechaLanzamiento: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        CantidadCanciones: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        timestamps: false,
    }
);

albumes.belongsTo(artistas, {
    foreignKey: 'ArtistaId',    
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    as: 'artista'
  });

albumes.belongsTo(generos, {
    foreignKey: 'GeneroId',    
    onDelete: "SET NULL",
    onUpdate: "SET NULL",
    as: 'genero'
  });
  

// Definición del modelo de Canciones
const canciones = sequelize.define(
    "canciones",
    {
        IdCancion: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Titulo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Duracion: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        AlbumId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'albumes',
                key: 'IdAlbum'
            },
            allowNull: false,
        },
    }, {
       timestamps: false,
    }
);

canciones.belongsTo(albumes, {
    foreignKey: 'AlbumId',    
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    as: 'album'
  });

  

// Definición del modelo de conciertos
const conciertos = sequelize.define(
    "conciertos",
    {
        IdConcierto: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: "El nombre del concierto ya existe"
            }
        },
        Fecha: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        Lugar: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ArtistaId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'artistas',
                key: 'IdArtista'
            },
            allowNull: false,
        },
        DuracionMinutos: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
       timestamps: false,
    }
);

conciertos.belongsTo(artistas, {
    foreignKey: 'ArtistaId',    
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    as: 'artista'
  });

// Definición del modelo de premios
const premios = sequelize.define(
    "premios",
    {
        IdPremio: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Descripcion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        FechaEntrega: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        ArtistaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'artistas',
                key: 'IdArtista'
            }
        },
    },
    {
        timestamps: false
    }
);

premios.belongsTo(artistas, {
    foreignKey: 'ArtistaId',    
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    as: 'artista'
  });

  
  const Usuarios = sequelize.define(
    'Usuarios',
    {
      Username: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: 'El nombre de usuario es requerido',
          },
          len: {
            args: [3, 20],
            msg: 'El nombre de usuario debe tener entre 3 y 20 caracteres',
          },
        },
      },
      Password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: 'La contraseña es requerida',
          },
          len: {
            args: [8, 100],
            msg: 'La contraseña debe tener entre 8 y 100 caracteres',
          },
        },
      },
      Rol: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'member', // Valor por defecto para nuevos usuarios
        validate: {
          isIn: {
            args: [['admin', 'member']], // Opciones válidas
            msg: 'El rol debe ser "admin" o "member"',
          },
        },
      },
    },
    {
      timestamps: false, // Desactiva columnas de timestamp por defecto (createdAt, updatedAt)
    }
  );
  

// Exportar sequelize y los modelos
module.exports = {
    sequelize,
    artistas,
    albumes,
    canciones,
    conciertos,
    generos,
    biografias,
    sellos,
    premios,
    Usuarios
};



/*/Sincronizar la base de datos (opcional, descomentar si se necesita)
(async () => {
    try {
        await sequelize.sync({ force: true }); // Usar force: true solo para desarrollo
        console.log("Base de datos sincronizada.");
    } catch (error) {
        console.error("Error al sincronizar la base de datos:", error);
    }
})();
*/