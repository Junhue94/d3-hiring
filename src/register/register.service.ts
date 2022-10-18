import { HttpCode, Injectable, Post } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { RegisterTeacherToStudentsDto } from "../dto/register-teacher-to-students.dto";
import { Teacher } from "../models/teacher.model";
import { Student } from "../models/student.model";

@Injectable()
export class RegisterService {
  constructor(
    @InjectModel(Teacher)
    private readonly teacherModel: typeof Teacher,

    @InjectModel(Student)
    private readonly studentModel: typeof Student,

    private sequelize: Sequelize,
  ) {}

  @Post()
  @HttpCode(204)
  async create(
    registerTeacherToStudentsDto: RegisterTeacherToStudentsDto,
  ): Promise<string> {
    const transaction = await this.sequelize.transaction();
    const { teacher, students } = registerTeacherToStudentsDto;
    try {
      await this.teacherModel.upsert(
        {
          email: teacher,
        },
        { transaction },
      );

      for (const student of students) {
        await this.studentModel.upsert(
          {
            email: student,
          },
          { transaction },
        );
      }

      await transaction.commit();
      return "Success";
    } catch (error) {
      await transaction.rollback();
      return "Failed";
    }
  }
}
