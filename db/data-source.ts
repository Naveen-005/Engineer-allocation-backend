import "reflect-metadata";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import 'dotenv/config'

const dataSource = new DataSource({
  type: "postgres",
  host: "dpg-d1619r8gjchc73fuvj0g-a.oregon-postgres.render.com",
  port: 5432,
  username: "trial_user",
  password: "ZevsjYeCHvdBuB0QOcINpdISulpJSFEA",
  database: "trial_db_a4xa",
  extra: { max: 5, min: 2 },
  synchronize: false,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
  entities: ["dist/entities/*.js"],
  migrations: ["dist/db/migrations/*.js"],
  ssl: {
    rejectUnauthorized: false,
  },
});


export default dataSource