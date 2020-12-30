import { Sequelize } from "sequelize";
import { SequelizeStorage, Umzug } from "umzug";

export const migrate = async ({ dbPath }: { dbPath: string }) => {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: dbPath,
  });
  const umzug = new Umzug({
    migrations: [
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
      {
        name: "02-add-estimate-column-to-tasks-table",
        async up() {
          sequelize.query(`
              ALTER TABLE tasks
                  RENAME TO tasksTemp;
          `);
          sequelize.query(`
              CREATE TABLE tasks
              (
                  id       INTEGER PRIMARY KEY AUTOINCREMENT,
                  name     TEXT    NOT NULL,
                  status   INTEGER NOT NULL,
                  estimate INTEGER
              );
          `);
          sequelize.query(`
              INSERT INTO tasks (id, name, status, estimate)
              SELECT id, name, status, NULL as estimate
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
                  id     INTEGER PRIMARY KEY AUTOINCREMENT,
                  name   TEXT    NOT NULL,
                  status INTEGER NOT NULL
              );
          `);
          sequelize.query(`
              INSERT INTO tasks (id, name, status)
              SELECT id, name, status
              FROM tasksTemp;
          `);
          sequelize.query(`
              DROP TABLE tasksTemp;
          `);
        },
      },
      {
        name: "03-add-actual-column-to-tasks-table",
        async up() {
          sequelize.query(`
              ALTER TABLE tasks
                  RENAME TO tasksTemp;
          `);
          sequelize.query(`
              CREATE TABLE tasks
              (
                  id       INTEGER PRIMARY KEY AUTOINCREMENT,
                  name     TEXT    NOT NULL,
                  status   INTEGER NOT NULL,
                  estimate INTEGER,
                  actual   INTEGER
              );
          `);
          sequelize.query(`
              INSERT INTO tasks (id, name, status, estimate, actual)
              SELECT id, name, status, estimate, NULL as actual
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
                  id       INTEGER PRIMARY KEY AUTOINCREMENT,
                  name     TEXT    NOT NULL,
                  status   INTEGER NOT NULL,
                  estimate INTEGER
              );
          `);
          sequelize.query(`
              INSERT INTO tasks (id, name, status, estimate)
              SELECT id, name, status, estimate
              FROM tasksTemp;
          `);
          sequelize.query(`
              DROP TABLE tasksTemp;
          `);
        },
      },
      {
        name: "04-add-status_changed_at-column-to-tasks-table",
        async up() {
          sequelize.query(`
              ALTER TABLE tasks
                  RENAME TO tasksTemp;
          `);
          sequelize.query(`
              CREATE TABLE tasks
              (
                  id                INTEGER PRIMARY KEY AUTOINCREMENT,
                  name              TEXT    NOT NULL,
                  status            INTEGER NOT NULL,
                  estimate          INTEGER,
                  actual            INTEGER,
                  status_changed_at INTEGER
              );
          `);
          sequelize.query(`
              INSERT INTO tasks (id, name, status, estimate, actual, status_changed_at)
              SELECT id, name, status, estimate, actual, NULL as status_changed_at
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
                  id       INTEGER PRIMARY KEY AUTOINCREMENT,
                  name     TEXT    NOT NULL,
                  status   INTEGER NOT NULL,
                  estimate INTEGER,
                  actual   INTEGER
              );
          `);
          sequelize.query(`
              INSERT INTO tasks (id, name, status, estimate, actual)
              SELECT id, name, status, estimate, actual
              FROM tasksTemp;
          `);
          sequelize.query(`
              DROP TABLE tasksTemp;
          `);
        },
      },
      {
        name: "05-create-templates-table-and-template-tasks-table",
        async up() {
          sequelize.query(`
              CREATE TABLE templates
              (
                  id                INTEGER PRIMARY KEY AUTOINCREMENT,
                  name              TEXT    NOT NULL,
                  status            INTEGER NOT NULL,
                  status_changed_at INTEGER
              );
          `);
          sequelize.query(`
              CREATE TABLE template_tasks
              (
                  id         INTEGER PRIMARY KEY AUTOINCREMENT,
                  templateId INTEGER,
                  name       TEXT NOT NULL,
                  estimate   INTEGER,
                  FOREIGN KEY (templateId) REFERENCES templates (id)
              );
          `);
        },
        async down() {
          sequelize.query(`
              DROP TABLE template_tasks;
          `);
          sequelize.query(`
              DROP TABLE templates;
          `);
        },
      },
    ],
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });
  await umzug.up();
};
