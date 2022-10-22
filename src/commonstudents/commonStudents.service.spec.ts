import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";
import { HttpException, HttpStatus } from "@nestjs/common";
import { getModelToken } from "@nestjs/sequelize";
import { Teacher } from "../models/teacher.model";
import { Student } from "../models/student.model";
import { CommonStudentsService } from "./commonStudents.service";
import { TeacherStudent } from "../models/teacher_student.model";
import { CommonStudentsQueryParamsDto } from "../dto/common-students-query-params.dto";

const commonStudentsQueryParamsDto: CommonStudentsQueryParamsDto = {
  teacher: "teacher@test.com",
};

describe("CommonStudentsService", () => {
  let service: CommonStudentsService;
  let teacherModel: typeof Teacher;
  let studentModel: typeof Student;
  let teacherStudentModel: typeof TeacherStudent;
  let sequelize: Sequelize;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommonStudentsService,
        {
          provide: getModelToken(Teacher),
          useValue: {
            upsert: jest.fn(),
          },
        },
        {
          provide: getModelToken(Student),
          useValue: {
            upsert: jest.fn(),
          },
        },
        {
          provide: getModelToken(TeacherStudent),
          useValue: {
            upsert: jest.fn(),
          },
        },
        {
          provide: Sequelize,
          useValue: {
            query: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CommonStudentsService>(CommonStudentsService);
    teacherModel = module.get<typeof Teacher>(getModelToken(Teacher));
    studentModel = module.get<typeof Student>(getModelToken(Student));
    teacherStudentModel = module.get<typeof TeacherStudent>(
      getModelToken(TeacherStudent),
    );
    sequelize = module.get<Sequelize>(Sequelize);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("get()", () => {
    it("should return correct result", async () => {
      const student = {
        "student.email": "student@test.com",
      };

      service.mapTeacherEmailArray = jest
        .fn()
        .mockReturnValueOnce([commonStudentsQueryParamsDto.teacher]);
      sequelize.query = jest.fn().mockResolvedValueOnce([[student]]);
      const result = await service.get(commonStudentsQueryParamsDto);

      expect(service.mapTeacherEmailArray).toHaveBeenCalledWith(
        commonStudentsQueryParamsDto,
      );
      expect(sequelize.query).toHaveBeenCalledWith(
        `
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
            \`teacher\`.\`email\` IN ('${[
              commonStudentsQueryParamsDto.teacher,
            ].join("','")}')
        ) filter_by_teachers
        GROUP BY 
          \`studentId\`
        HAVING 
          count(\`studentId\`) >= ${
            [commonStudentsQueryParamsDto.teacher].length
          };
      `,
      );
      expect(result).toEqual({
        students: [student["student.email"]],
      });
    });

    it("should return empty array if no common student found", async () => {
      const student = {
        "student.email": "student@test.com",
      };

      service.mapTeacherEmailArray = jest
        .fn()
        .mockReturnValueOnce([commonStudentsQueryParamsDto.teacher]);
      sequelize.query = jest.fn().mockResolvedValueOnce(null);
      const result = await service.get(commonStudentsQueryParamsDto);

      expect(result).toEqual({
        students: [],
      });
    });

    it("should throw error", async () => {
      service.mapTeacherEmailArray = jest
        .fn()
        .mockReturnValueOnce([commonStudentsQueryParamsDto.teacher]);
      sequelize.query = jest
        .fn()
        .mockRejectedValue(new Error("Database Error"));
      await expect(
        service.get(commonStudentsQueryParamsDto),
      ).rejects.toThrowError(
        new HttpException(
          "Error in retrieving common students",
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe("mapTeacherEmailArray()", () => {
    it("should return correct result for single teacher in query param", () => {
      const result = service.mapTeacherEmailArray(commonStudentsQueryParamsDto);
      expect(result).toEqual([commonStudentsQueryParamsDto.teacher]);
    });

    it("should return correct result for an array of teacher in query param", () => {
      const commonStudentsQueryParamsDto = {
        teacher: [
          "teacher1@test.com",
          "teacher2@test.com",
          "teacher3@test.com",
        ],
      };
      const result = service.mapTeacherEmailArray(commonStudentsQueryParamsDto);
      expect(result).toEqual(commonStudentsQueryParamsDto.teacher);
    });

    it("should return empty array if teacher is not provided", () => {
      const commonStudentsQueryParamsDto = {} as CommonStudentsQueryParamsDto;
      const result = service.mapTeacherEmailArray(commonStudentsQueryParamsDto);
      expect(result).toEqual([]);
    });
  });
});
