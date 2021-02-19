import * as path from "path";
import { Sequelize } from "sequelize";
import { SequelizeStorage, Umzug } from "umzug";

export const migrate = async ({ dbPath }: { dbPath: string }) => {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: dbPath,
  });

  const umzug = new Umzug({
    migrations: { glob: path.join(__dirname, "migrations/*.js") },
    context: sequelize,
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

  await umzug.up();
};
