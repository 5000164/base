const up = async ({ context: sequelize }) => {
  await sequelize.query(`
      ALTER TABLE task_tracks
          RENAME TO task_tracks_temp;
  `);
  await sequelize.query(`
      CREATE TABLE task_tracks
      (
          task_track_id INTEGER PRIMARY KEY AUTOINCREMENT,
          task_id       INTEGER NOT NULL,
          start_at      INTEGER NOT NULL,
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
};

module.exports = { up };
