import { Sequelize } from "sequelize";
import { migrationsList, Umzug } from "umzug";

export const migrate = async ({ dbPath }: { dbPath: string }) => {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: dbPath,
  });
  const umzug = new Umzug({
    storage: "sequelize",
    storageOptions: { sequelize },
    migrations: migrationsList([
      {
        name: "00-create-tasks-table",
        async up() {
          sequelize.query(`
              CREATE TABLE tasks
              (
                  id   INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT NOT NULL
              );
          `);
        },
        async down() {
          sequelize.query(`
              DROP TABLE tasks;
          `);
        },
      },
      {
        name: "01-add-status-column-to-tasks-table",
        async up() {
          sequelize.query(`
              ALTER TABLE tasks
                  RENAME TO tasksTemp;
          `);
          sequelize.query(`
              CREATE TABLE tasks
              (
                  id     INTEGER PRIMARY KEY AUTOINCREMENT,
                  name   TEXT    NOT NULL,
                  status INTEGER NOT NULL
              );
          `);
          sequelize.query(`
              INSERT INTO tasks (id, name, status)
              SELECT id, name, 0 AS status
              FROM tasksTemp;
          `);
          sequelize.query(`
              DROP TABLE tasksTemp;
          `);
        },
        async down() {
          sequelize.query(`
              ALTER TABLE tasks
                  RENAME TO tasksTemp;
          `);
          sequelize.query(`
              CREATE TABLE tasks
              (
                  id   INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT NOT NULL
              );
          `);
          sequelize.query(`
              INSERT INTO tasks (id, name)
              SELECT id, name
              FROM tasksTemp;
          `);
          sequelize.query(`
              DROP TABLE tasksTemp;
          `);
        },
      },
    ]),
  });
  await umzug.up();
};
