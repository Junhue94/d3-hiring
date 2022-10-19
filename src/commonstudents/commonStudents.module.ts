import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CommonStudentsController } from "./commonStudents.controller";
import { CommonStudentsService } from "./commonStudents.service";
import { TeacherStudent } from "../models/teacher_student.model";
import { Teacher } from "../models/teacher.model";
import { Student } from "../models/student.model";

@Module({
  imports: [SequelizeModule.forFeature([TeacherStudent, Teacher, Student])],
  providers: [CommonStudentsService],
  controllers: [CommonStudentsController],
})
export class CommonStudentsModule {}
