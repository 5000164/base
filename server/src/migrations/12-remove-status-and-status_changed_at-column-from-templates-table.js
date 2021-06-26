const up = async ({ context: sequelize }) => {
  await sequelize.query(`
      ALTER TABLE templates
          RENAME TO templates_temp;
  `);
  await sequelize.query(`
      CREATE TABLE templates
      (
          id   INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL
      );
  `);
  await sequelize.query(`
      INSERT INTO templates (id, name)
      SELECT id,
             name
      FROM templates_temp;
  `);

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
             previous_id,
             next_id
      FROM template_tasks_temp;
  `);

  await sequelize.query(`
      DROP TABLE template_tasks_temp;
  `);
  await sequelize.query(`
      DROP TABLE templates_temp;
  `);
};

module.exports = { up };
