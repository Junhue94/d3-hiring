import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/sequelize";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Student } from "../models/student.model";
import { SuspendService } from "./suspend.service";
import { SuspendStudentDto } from "../dto/suspend-student.dto";

const suspendStudentDto: SuspendStudentDto = {
  student: "student1@test.com",
};

const transaction = {
  commit: jest.fn(),
  rollback: jest.fn(),
};

describe("SuspendService", () => {
  let service: SuspendService;
  let studentModel: typeof Student;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuspendService,
        {
          provide: getModelToken(Student),
          useValue: {
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SuspendService>(SuspendService);
    studentModel = module.get<typeof Student>(getModelToken(Student));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("update()", () => {
    it("should successfully suspend student", async () => {
      await service.update(suspendStudentDto);
      expect(studentModel.update).toHaveBeenCalledWith(
        {
          isSuspended: true,
        },
        {
          where: {
            email: suspendStudentDto.student,
          },
        },
      );
    });

    it("should throw error", async () => {
      studentModel.update = jest
        .fn()
        .mockRejectedValue(new Error("Database Error"));

      await expect(service.update(suspendStudentDto)).rejects.toThrowError(
        new HttpException(
          "Error in suspending student",
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });
});
