const up = async ({ context: sequelize }) => {
  await sequelize.query(`
      ALTER TABLE tasks
          RENAME TO tasksTemp;
  `);
  await sequelize.query(`
      CREATE TABLE tasks
      (
          id       INTEGER PRIMARY KEY AUTOINCREMENT,
          name     TEXT    NOT NULL,
          status   INTEGER NOT NULL,
          estimate INTEGER
      );
  `);
  await sequelize.query(`
      INSERT INTO tasks (id, name, status, estimate)
      SELECT id, name, status, NULL as estimate
      FROM tasksTemp;
  `);
  await sequelize.query(`
      DROP TABLE tasksTemp;
  `);
};

module.exports = { up };
