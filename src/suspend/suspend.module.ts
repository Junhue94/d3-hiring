import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { SuspendController } from "./suspend.controller";
import { SuspendService } from "./suspend.service";
import { Student } from "../models/student.model";

@Module({
  imports: [SequelizeModule.forFeature([Student])],
  providers: [SuspendService],
  controllers: [SuspendController],
})
export class SuspendModule {}
