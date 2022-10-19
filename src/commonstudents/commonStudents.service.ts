import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { TeacherStudent } from "../models/teacher_student.model";
import { CommonStudentsQueryParamsDto } from "../dto/common-students-query-params.dto";
import { Teacher } from "../models/teacher.model";
import { Student } from "../models/student.model";
import { CommonStudentsResultDto } from "../dto/common-students-result.dto";

@Injectable()
export class CommonStudentsService {
  constructor(
    @InjectModel(Teacher)
    private readonly teacherModel: typeof Teacher,

    @InjectModel(Student)
    private readonly studentModel: typeof Student,

    @InjectModel(TeacherStudent)
    private readonly teacherStudentModel: typeof TeacherStudent,

    private sequelize: Sequelize,
  ) {}

  async get(
    commonStudentsQueryParamsDto: CommonStudentsQueryParamsDto,
  ): Promise<CommonStudentsResultDto> {
    const teacherEmailArray = this.mapTeacherEmailArray(
      commonStudentsQueryParamsDto,
    );

    const result = await this.sequelize.query(`
      SELECT \`studentId\`, \`student.email\` 
      FROM 
      (
        SELECT 
          \`TeacherStudent\`.\`teacher_student_id\` AS \`teacherStudentId\`, 
          \`TeacherStudent\`.\`teacher_id\` AS \`teacherId\`, 
          \`TeacherStudent\`.\`student_id\` AS \`studentId\`, 
          \`teacher\`.\`teacher_id\` AS \`teacher.teacherId\`, 
          \`teacher\`.\`email\` AS \`teacher.email\`, 
          \`student\`.\`student_id\` AS \`student.studentId\`, 
          \`student\`.\`email\` AS \`student.email\`
        FROM 
          \`teacher_student\` AS \`TeacherStudent\` 
          INNER JOIN \`teacher\` AS \`teacher\` ON \`TeacherStudent\`.\`teacher_id\` = \`teacher\`.\`teacher_id\` 
          INNER JOIN \`student\` AS \`student\` ON \`TeacherStudent\`.\`student_id\` = \`student\`.\`student_id\` 
        WHERE 
          \`teacher\`.\`email\` IN ('${teacherEmailArray.join("','")}')
      ) filter_by_teachers
      GROUP BY 
        \`studentId\`
      HAVING 
        count(\`studentId\`) >= ${teacherEmailArray.length};
    `);

    if (Array.isArray(result)) {
      return {
        students: result[0].map((student) => student["student.email"]),
      };
    }
    return { students: [] };
  }

  mapTeacherEmailArray(
    commonStudentsQueryParamsDto: CommonStudentsQueryParamsDto,
  ) {
    if (commonStudentsQueryParamsDto.teacher) {
      if (Array.isArray(commonStudentsQueryParamsDto.teacher)) {
        return commonStudentsQueryParamsDto.teacher;
      }
      return [commonStudentsQueryParamsDto.teacher];
    } else {
      return [];
    }
  }
}
