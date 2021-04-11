const up = async ({ context: sequelize }) => {
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
};

module.exports = { up };
