const up = async ({ context: sequelize }) => {
  await sequelize.query(`ALTER TABLE tasks RENAME TO tasks_temp;`);
  await sequelize.query(
    `
        CREATE TABLE tasks
        (
            id                INTEGER PRIMARY KEY AUTOINCREMENT,
            name              TEXT    NOT NULL,
            status            INTEGER NOT NULL,
            estimate          INTEGER,
            scheduled_date    INTEGER,
            status_changed_at INTEGER,
            previous_id       INTEGER,
            next_id           INTEGER,
            FOREIGN KEY (previous_id) REFERENCES tasks (id),
            FOREIGN KEY (next_id) REFERENCES tasks (id)
        );
    `
  );
  // Unix time を秒からミリ秒に単位を変更する
  // scheduled_date はローカルタイムの 0 時 0 分を記録していたので UTC の 0 時 0 分にする
  await sequelize.query(
    `
        INSERT INTO tasks (id, name, status, estimate, scheduled_date, status_changed_at, previous_id, next_id)
        SELECT id,
               name,
               status,
               estimate,
               (scheduled_date - ${
                 new Date().getTimezoneOffset() * 60
               }) * 1000                as scheduled_date,
               status_changed_at * 1000 as status_changed_at,
               previous_id,
               next_id
        FROM tasks_temp;
    `
  );

  await sequelize.query(`ALTER TABLE task_tracks RENAME TO task_tracks_temp;`);
  await sequelize.query(
    `
        CREATE TABLE task_tracks
        (
            task_track_id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id       INTEGER NOT NULL,
            start_at      INTEGER NOT NULL,
            stop_at       INTEGER,
            FOREIGN KEY (task_id) REFERENCES tasks (id)
        );
    `
  );
  // Unix time を秒からミリ秒に単位を変更する
  await sequelize.query(
    `
        INSERT INTO task_tracks (task_track_id, task_id, start_at, stop_at)
        SELECT task_track_id,
               task_id,
               start_at * 1000 as start_at,
               stop_at * 1000  as stop_at
        FROM task_tracks_temp;
    `
  );

  await sequelize.query(`DROP TABLE task_tracks_temp;`);
  await sequelize.query(`DROP TABLE tasks_temp;`);
};

module.exports = { up };
