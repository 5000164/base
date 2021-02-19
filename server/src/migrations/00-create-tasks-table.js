const up = async ({ context: sequelize }) => {
  await sequelize.query(`
      CREATE TABLE tasks
      (
          id   INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL
      );
  `);
};

module.exports = { up };
