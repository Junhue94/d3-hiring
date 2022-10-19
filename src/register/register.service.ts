import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { RegisterTeacherToStudentsDto } from "../dto/register-teacher-to-students.dto";
import { Teacher } from "../models/teacher.model";
import { Student } from "../models/student.model";
import { TeacherStudent } from "../models/teacher_student.model";

@Injectable()
export class RegisterService {
  constructor(
    @InjectModel(Teacher)
    private readonly teacherModel: typeof Teacher,

    @InjectModel(Student)
    private readonly studentModel: typeof Student,

    @InjectModel(TeacherStudent)
    private readonly teacherStudentModel: typeof TeacherStudent,

    private sequelize: Sequelize,
  ) {}

  async create(
    registerTeacherToStudentsDto: RegisterTeacherToStudentsDto,
  ): Promise<string> {
    const transaction = await this.sequelize.transaction();
    const { teacher, students } = registerTeacherToStudentsDto;
    try {
      const teacherModel = await this.teacherModel.upsert(
        {
          email: teacher,
        },
        { transaction },
      );
      const teacherModelJson = teacherModel[0].toJSON();

      for (const student of students) {
        const studentModel = await this.studentModel.upsert(
          {
            email: student,
          },
          { transaction },
        );
        const studentModelJson = studentModel[0].toJSON();

        await this.teacherStudentModel.upsert(
          {
            teacherId: teacherModelJson.teacherId,
            studentId: studentModelJson.studentId,
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
