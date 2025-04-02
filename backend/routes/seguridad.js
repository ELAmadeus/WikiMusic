const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../seguridad/auth");
const { Usuarios } = require("../base-orm/sequelize-init");
const bcrypt = require('bcryptjs');

let refreshTokens = [];

router.post("/api/login", async (req, res) => {
    // #swagger.tags = ['Seguridad']
    // #swagger.summary = 'Login de usuarios desde base de datos'
    const { usuario, clave } = req.body;

        
        const user = await Usuarios.findOne({ where: { Username: usuario } });

        if (user) {            
            const isPasswordValid = await bcrypt.compare(clave, user.Password);

            if (isPasswordValid) {
                
                const accessToken = jwt.sign(
                    { usuario: user.Username, rol: user.Rol },
                    auth.accessTokenSecret,
                    { expiresIn: "20m" }
                );
                const refreshToken = jwt.sign(
                    { usuario: user.Username, rol: user.Rol },
                    auth.refreshTokenSecret
                );
                refreshTokens.push(refreshToken);

                return res.json({
                    accessToken,
                    refreshToken,
                    message: `Bienvenido ${user.Username}!`,
                });
            }
        }
        else {
            res.json({ message: "usuario or clave incorrecto" });
    }
});
router.post("/api/logout", (req, res) => {
// #swagger.tags = ['Seguridad']
// #swagger.summary = 'Logout: invalida el refresh token (no invalida el token actual!!!)'
// recordar que el token sigue válido hasta que expire, aquí evitamos que pueda renovarse cuando expire!
let message = "Logout inválido!";
const { token } = req.body;
if (refreshTokens.includes(token)) {
    message = "Usuario deslogueado!";
}
refreshTokens = refreshTokens.filter((t) => t !== token);
res.json({ message });
});

router.post("/api/token", (req, res) => {
    // #swagger.tags = ['Seguridad']
    // #swagger.summary = 'refresh token'
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.sendStatus(401);
    }
    if (!refreshTokens.includes(refreshToken)) {
        return res.sendStatus(403);
    }
    jwt.verify(refreshToken, auth.refreshTokenSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        const accessToken = jwt.sign(
            { usuario: user.usuario, rol: user.rol },
            auth.accessTokenSecret,
            { expiresIn: "20m" }
        );
        res.json({
            accessToken,
        });
    });
});
module.exports = router;

