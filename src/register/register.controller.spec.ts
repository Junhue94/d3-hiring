import { Test, TestingModule } from "@nestjs/testing";
import { RegisterTeacherToStudentsDto } from "../dto/register-teacher-to-students.dto";
import { RegisterController } from "./register.controller";
import { RegisterService } from "./register.service";

const registerTeacherToStudentsDto: RegisterTeacherToStudentsDto = {
  teacher: "teacher@test.com",
  students: ["student1@test.com", "student2@test.com"],
};

describe("RegisterController", () => {
  let registerController: RegisterController;
  let registerService: RegisterService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RegisterController],
      providers: [
        {
          provide: RegisterService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    registerController = app.get<RegisterController>(RegisterController);
    registerService = app.get<RegisterService>(RegisterService);
  });

  it("should be defined", () => {
    expect(registerController).toBeDefined();
  });

  describe("create()", () => {
    it("should call registerService.create", async () => {
      await registerController.create(registerTeacherToStudentsDto);
      expect(registerService.create).toHaveBeenCalled();
      expect(registerService.create).toHaveBeenCalledWith(
        registerTeacherToStudentsDto,
      );
    });
  });
});
