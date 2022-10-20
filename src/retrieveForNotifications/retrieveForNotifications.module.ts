import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { RetrieveForNotificationsController } from "./retrieveForNotifications.controller";
import { RetrieveForNotificationsService } from "./retrieveForNotifications.service";
import { Teacher } from "../models/teacher.model";
import { Student } from "../models/student.model";
import { TeacherStudent } from "../models/teacher_student.model";

@Module({
  imports: [SequelizeModule.forFeature([TeacherStudent, Teacher, Student])],
  providers: [RetrieveForNotificationsService],
  controllers: [RetrieveForNotificationsController],
})
export class RetrieveForNotificationsModule {}
