const up = async ({ context: sequelize }) => {
  await sequelize.query(`
      CREATE TABLE templates
      (
          id                INTEGER PRIMARY KEY AUTOINCREMENT,
          name              TEXT    NOT NULL,
          status            INTEGER NOT NULL,
          status_changed_at INTEGER
      );
  `);
  await sequelize.query(`
      CREATE TABLE template_tasks
      (
          id         INTEGER PRIMARY KEY AUTOINCREMENT,
          templateId INTEGER,
          name       TEXT NOT NULL,
          estimate   INTEGER,
          FOREIGN KEY (templateId) REFERENCES templates (id)
      );
  `);
};

module.exports = { up };
