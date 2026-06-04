import { Sequelize } from "sequelize";

let db: Sequelize | null = null;

export default function mysql() {
    if (db == null) {
        db = new Sequelize({
            dialect: 'mysql',
            host: process.env.MYSQL_HOST,
            username: process.env.MYSQL_USERNAME,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            logging: false,
        });
    }
    return db;
}