import { Sequelize } from 'sequelize';

let db: Sequelize | null = null;

export default function sqlite3() {
    if (db == null) {
        db = new Sequelize({
            dialect: 'sqlite',
            storage: 'prednidrone.db',
            logging: false,
        });
    }
    return db;
}