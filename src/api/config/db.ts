import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();
const conex = mysql.createConnection(process.env.DATABASE_URL as string);

export default conex.promise();
