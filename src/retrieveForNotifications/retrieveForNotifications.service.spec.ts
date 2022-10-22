import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/sequelize";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Teacher } from "../models/teacher.model";
import { Student } from "../models/student.model";
import { RetrieveForNotificationsService } from "./retrieveForNotifications.service";
import { TeacherStudent } from "../models/teacher_student.model";
import { RetrieveForNotificationsDto } from "../dto/retrieve-for-notifications.dto";
import { Op } from "sequelize";

const retrieveForNotificationsDto: RetrieveForNotificationsDto = {
  teacher: "teacher@test.com",
  notification: "Hello students! @student1@gmail.com",
};

describe("RetrieveForNotificationsService", () => {
  let service: RetrieveForNotificationsService;
  let teacherModel: typeof Teacher;
  let studentModel: typeof Student;
  let teacherStudentModel: typeof TeacherStudent;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RetrieveForNotificationsService,
        {
          provide: getModelToken(Teacher),
          useValue: {},
        },
        {
          provide: getModelToken(Student),
          useValue: {},
        },
        {
          provide: getModelToken(TeacherStudent),
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RetrieveForNotificationsService>(
      RetrieveForNotificationsService,
    );
    teacherModel = module.get<typeof Teacher>(getModelToken(Teacher));
    studentModel = module.get<typeof Student>(getModelToken(Student));
    teacherStudentModel = module.get<typeof TeacherStudent>(
      getModelToken(TeacherStudent),
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("get()", () => {
    it("should return correct recipients", async () => {
      const studentEmail = ["student1@gmail.com"];

      service.extractEmails = jest.fn().mockReturnValueOnce(studentEmail);
      teacherStudentModel.findAll = jest.fn().mockResolvedValueOnce([
        {
          "student.email": "student1@gmail.com",
        },
      ]);
      const result = await service.get(retrieveForNotificationsDto);

      expect(service.extractEmails).toHaveBeenCalledWith(
        retrieveForNotificationsDto.notification,
      );
      expect(teacherStudentModel.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: Teacher,
            required: true,
          },
          {
            model: Student,
            required: true,
          },
        ],
        where: {
          [Op.and]: {
            "$student.is_suspended$": false,
            [Op.or]: {
              "$teacher.email$": retrieveForNotificationsDto.teacher,
              "$student.email$": studentEmail,
            },
          },
        },
        raw: true,
      });
      expect(result).toEqual({
        recipients: ["student1@gmail.com"],
      });
    });

    it("should throw error", async () => {
      service.extractEmails = jest.fn().mockReturnValueOnce([]);
      teacherModel.findAll = jest
        .fn()
        .mockRejectedValue(new Error("Database Error"));

      await expect(
        service.get(retrieveForNotificationsDto),
      ).rejects.toThrowError(
        new HttpException(
          "Error in retrieving list of students",
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe("extractEmails()", () => {
    it("should return correct result when string contain email", async () => {
      const result = service.extractEmails(
        "Hello students! @student1@gmail.com",
      );
      expect(result).toEqual(["student1@gmail.com"]);
    });

    it("should return correct result when string contain multiple emails", async () => {
      const result = service.extractEmails(
        "Hello students! @student1@gmail.com @student2@gmail.com",
      );
      expect(result).toEqual(["student1@gmail.com", "student2@gmail.com"]);
    });

    it("should return correct result when string does not contain email", async () => {
      const result = service.extractEmails("Hello students!");
      expect(result).toEqual(null);
    });
  });
});
