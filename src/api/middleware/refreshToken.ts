import jwt from "jsonwebtoken";
import { tokenValid } from '../index';

// Supongamos que los refresh tokens válidos están en DB:
export default async function refreshTokens() {
    const payload: object = process.env.payloadDev ? 
      JSON.parse(process.env.payloadDev) : {};

    // 3. Generar nuevos tokens
    const newAccessToken = jwt.sign(
        payload,
        process.env.JWT_SECRET!,
        { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
        payload,
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    );

    // 4. colocando tokens nuevos a tokensValid
    tokenValid.length = 0;
    tokenValid.push(newAccessToken, newRefreshToken);
}
