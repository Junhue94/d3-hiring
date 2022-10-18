import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Teacher } from "../models/teacher.model";
import { Student } from "../models/student.model";
import { RegisterController } from "./register.controller";
import { RegisterService } from "./register.service";
import { TeacherStudent } from "../models/teacher_student.model";

@Module({
  imports: [SequelizeModule.forFeature([Teacher, Student, TeacherStudent])],
  providers: [RegisterService],
  controllers: [RegisterController],
})
export class RegisterModule {}
