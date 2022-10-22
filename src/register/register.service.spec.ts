import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";
import { getModelToken } from "@nestjs/sequelize";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Teacher } from "../models/teacher.model";
import { Student } from "../models/student.model";
import { RegisterService } from "./register.service";
import { RegisterTeacherToStudentsDto } from "../dto/register-teacher-to-students.dto";
import { TeacherStudent } from "../models/teacher_student.model";

const registerTeacherToStudentsDto: RegisterTeacherToStudentsDto = {
  teacher: "teacher@test.com",
  students: ["student1@test.com"],
};

const transaction = {
  commit: jest.fn(),
  rollback: jest.fn(),
};

describe("RegisterService", () => {
  let service: RegisterService;
  let teacherModel: typeof Teacher;
  let studentModel: typeof Student;
  let teacherStudentModel: typeof TeacherStudent;
  let sequelize: Sequelize;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
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
            transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RegisterService>(RegisterService);
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

  describe("create()", () => {
    it("should successfully upsert teacher and students", async () => {
      sequelize.transaction = jest.fn().mockResolvedValueOnce(transaction);
      teacherModel.upsert = jest.fn().mockResolvedValueOnce([
        {
          teacherId: 1,
          email: registerTeacherToStudentsDto.teacher,
        },
      ]);
      studentModel.upsert = jest
        .fn()
        .mockResolvedValueOnce([
          { studentId: 1, email: registerTeacherToStudentsDto.students },
        ]);
      teacherStudentModel.upsert = jest.fn();
      await service.create(registerTeacherToStudentsDto);

      expect(sequelize.transaction).toHaveBeenCalled();
      expect(teacherModel.upsert).toHaveBeenCalledWith(
        {
          email: registerTeacherToStudentsDto.teacher,
        },
        { transaction },
      );
      expect(studentModel.upsert).toHaveBeenCalledWith(
        {
          email: registerTeacherToStudentsDto.students[0],
        },
        { transaction },
      );
      expect(teacherStudentModel.upsert).toHaveBeenCalledWith(
        {
          teacherId: 1,
          studentId: 1,
        },
        { transaction },
      );
      expect(transaction.commit).toHaveBeenCalled();
    });

    it("should throw error", async () => {
      sequelize.transaction = jest.fn().mockResolvedValueOnce(transaction);
      teacherModel.upsert = jest
        .fn()
        .mockRejectedValue(new Error("Database Error"));

      await expect(
        service.create(registerTeacherToStudentsDto),
      ).rejects.toThrowError(
        new HttpException(
          "Error in registering student(s) to teacher",
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });
});
