const up = async ({ context: sequelize }) => {
  await sequelize.query(`
      ALTER TABLE tasks
          RENAME TO tasksTemp;
  `);
  await sequelize.query(`
      CREATE TABLE tasks
      (
          id                INTEGER PRIMARY KEY AUTOINCREMENT,
          name              TEXT    NOT NULL,
          status            INTEGER NOT NULL,
          estimate          INTEGER,
          actual            INTEGER,
          status_changed_at INTEGER,
          previous_id       INTEGER,
          next_id           INTEGER,
          FOREIGN KEY (previous_id) REFERENCES tasks (id),
          FOREIGN KEY (next_id) REFERENCES tasks (id)
      );
  `);
  await sequelize.query(`
      INSERT INTO tasks (id, name, status, estimate, actual, status_changed_at, previous_id, next_id)
      SELECT id,
             name,
             status,
             estimate,
             actual,
             status_changed_at,
             NULL as previous_id,
             NULL as next_id
      FROM tasksTemp;
  `);
  await sequelize.query(`
      DROP TABLE tasksTemp;
  `);
};

module.exports = { up };
