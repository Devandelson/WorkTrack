import express from 'express';
import cors from 'cors';
import conex from './config/db';
import indexRouter from './routes/index.routes';
import routNotFound from './middleware/routNotFound';
import protectionEndpoint from './middleware/protectionEnpoint';
import Jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import type { Request, Response } from "express";
import refreshTokens from './middleware/refreshToken';
import helmet from 'helmet';
import rateLimit from "express-rate-limit";

const tokenValid: Array<string> = [];

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 10, // máximo de 10 peticiones por IP
  message: "Demasiadas solicitudes desde esta IP, inténtalo en un minuto."
});

const app = express();
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(cors());

app.set('port', process.env.PORT || 3000);

const prefijo = '/api';
app.use(prefijo, protectionEndpoint, indexRouter);

app.listen(app.get('port'), () => {
    console.log(`Server is running on port ${app.get('port')}`);
})

// generateToken
app.get('/GetToken', async (req: Request, res: Response) => {
    if (tokenValid.length < 1) {
        const payload: object = process.env.payloadDev
            ? JSON.parse(process.env.payloadDev)
            : {};

        const secret: string = process.env.JWT_SECRET as string;

        const options: Jwt.SignOptions = { expiresIn: '20s' };
        const newAccessToken = Jwt.sign(payload, secret, options);

        const options2: Jwt.SignOptions = { expiresIn: '1h' };
        const newRefreshToken = Jwt.sign(payload, secret, options2);

        tokenValid.push(newAccessToken, newRefreshToken);

        res.json({ AccessToken: newAccessToken });
        return console.log(newAccessToken, ' - ', newRefreshToken);
    } else {
        try {
            Jwt.verify( tokenValid[0], process.env.JWT_SECRET as string) as JwtPayload;
            res.json({ AccessToken: tokenValid[0] });
        } catch {
            await refreshTokens();
            res.json({ AccessToken: tokenValid[0] });
        }
    }
});

// conectando a la base de datos
conex.connect().then(() => {
    console.log('Conexión establecida correctamente.');
}).catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
});

app.use(routNotFound);
export { app, tokenValid };
