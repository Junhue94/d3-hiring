import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import * as dotenv from "dotenv";

import { RegisterModule } from "./register/register.module";
import { CommonStudentsModule } from "./commonstudents/commonStudents.module";

dotenv.config();

const MYSQL_HOST = process.env.MYSQL_HOST || "";
const MYSQL_PORT = parseInt(process.env.MYSQL_PORT) || 3306;
const MYSQL_USERNAME = process.env.MYSQL_USERNAME || "";
const MYSQL_PASSSWORD = process.env.MYSQL_PASSSWORD || "";
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || "";

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: "mysql",
      host: MYSQL_HOST,
      port: MYSQL_PORT,
      username: MYSQL_USERNAME,
      password: MYSQL_PASSSWORD,
      database: MYSQL_DATABASE,
      autoLoadModels: true,
      synchronize: true,
    }),
    RegisterModule,
    CommonStudentsModule,
  ],
})
export class AppModule {}
