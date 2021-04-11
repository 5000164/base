const up = async ({ context: sequelize }) => {
  await sequelize.query(`
      ALTER TABLE template_tasks
          RENAME TO template_tasks_temp;
  `);
  await sequelize.query(`
      CREATE TABLE template_tasks
      (
          id          INTEGER PRIMARY KEY AUTOINCREMENT,
          templateId  INTEGER,
          name        TEXT NOT NULL,
          estimate    INTEGER,
          previous_id INTEGER,
          next_id     INTEGER,
          FOREIGN KEY (templateId) REFERENCES templates (id),
          FOREIGN KEY (previous_id) REFERENCES template_tasks (id),
          FOREIGN KEY (next_id) REFERENCES template_tasks (id)
      );
  `);
  await sequelize.query(`
      INSERT INTO template_tasks (id, templateId, name, estimate, previous_id, next_id)
      SELECT id,
             templateId,
             name,
             estimate,
             NULL as previous_id,
             NULL as next_id
      FROM template_tasks_temp;
  `);
  await sequelize.query(`
      DROP TABLE template_tasks_temp;
  `);
};

module.exports = { up };
