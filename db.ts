import {Sequelize, DataTypes, Model, Optional} from 'sequelize';
import sqlite3 from './sqlite3';
import { ENVIRONMENT } from './env';
import mysql from './mysql';

function select_db() {
    if (ENVIRONMENT == 'DEV') {
        return sqlite3();
    } else {
        return mysql();
    }
}

const sequelize = select_db();

interface Option {
    id: string,
    value: string,
}

interface AssignableRole {
    id: string;
    type: 'pronoun'|'arthritis';
}

interface ApplicationCommand {
    id: string,
    name: string,
}

export const Option = sequelize.define<Model<Option>>('Option',{
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

export const AssignableRole = sequelize.define<Model<AssignableRole>>('AssignableRole',{
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING(30),
        allowNull: false,
    }
});

export const ApplicationCommand = sequelize.define<Model<ApplicationCommand>>('ApplicationCommand',{
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})
export function setup_database() {
    return sequelize.sync({force:false});
}