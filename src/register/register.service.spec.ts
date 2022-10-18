import { Test, TestingModule } from "@nestjs/testing";
import { Teacher } from "../models/teacher.model";
import { Student } from "../models/student.model";
import { RegisterService } from "./register.service";
import { getModelToken } from "@nestjs/sequelize";
import { RegisterTeacherToStudentsDto } from "../dto/register-teacher-to-students.dto";

const registerTeacherToStudentsDto: RegisterTeacherToStudentsDto = {
  teacher: "teacher@test.com",
  students: ["student1@test.com", "student2@test.com"],
};

describe("RegisterService", () => {
  let service: RegisterService;
  let teacherModel: typeof Teacher;
  let studentModel: typeof Student;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        {
          provide: getModelToken(Teacher),
          useValue: {
            create: jest.fn(() => "Success"),
          },
        },
        {
          provide: getModelToken(Student),
          useValue: {
            create: jest.fn(() => "Success"),
          },
        },
      ],
    }).compile();

    service = module.get<RegisterService>(RegisterService);
    teacherModel = module.get<typeof Teacher>(getModelToken(Teacher));
    studentModel = module.get<typeof Student>(getModelToken(Student));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create()", () => {
    it("should successfully upsert teacher and students", () => {
      expect(service.create(registerTeacherToStudentsDto)).toEqual("Success");
    });
  });
});
