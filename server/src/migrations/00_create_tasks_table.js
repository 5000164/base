const { Sequelize } = require("sequelize");

async function up(queryInterface) {
  await queryInterface.createTable("tasks", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  });
}

async function down(queryInterface) {
  await queryInterface.dropTable("tasks");
}

module.exports = { up, down };
