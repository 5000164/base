const up = async ({ context: sequelize }) => {
  await sequelize.query(`
      ALTER TABLE tasks
          RENAME TO tasks_temp;
  `);
  await sequelize.query(`
      CREATE TABLE tasks
      (
          id                INTEGER PRIMARY KEY AUTOINCREMENT,
          name              TEXT    NOT NULL,
          status            INTEGER NOT NULL,
          estimate          INTEGER,
          status_changed_at INTEGER,
          previous_id       INTEGER,
          next_id           INTEGER,
          FOREIGN KEY (previous_id) REFERENCES tasks (id),
          FOREIGN KEY (next_id) REFERENCES tasks (id)
      );
  `);
  await sequelize.query(`
      INSERT INTO tasks (id, name, status, estimate, status_changed_at, previous_id, next_id)
      SELECT id,
             name,
             status,
             estimate,
             status_changed_at,
             previous_id,
             next_id
      FROM tasks_temp;
  `);

  await sequelize.query(`
      ALTER TABLE task_tracks
          RENAME TO task_tracks_temp;
  `);
  await sequelize.query(`
      CREATE TABLE task_tracks
      (
          task_track_id INTEGER PRIMARY KEY AUTOINCREMENT,
          task_id       INTEGER NOT NULL,
          start_at      INTEGER,
          stop_at       INTEGER,
          FOREIGN KEY (task_id) REFERENCES tasks (id)
      );
  `);
  await sequelize.query(`
      INSERT INTO task_tracks (task_track_id, task_id, start_at, stop_at)
      SELECT task_track_id,
             task_id,
             start_at,
             stop_at
      FROM task_tracks_temp;
  `);

  await sequelize.query(`
      DROP TABLE task_tracks_temp;
  `);
  await sequelize.query(`
      DROP TABLE tasks_temp;
  `);
};

module.exports = { up };
