import { Test, TestingModule } from "@nestjs/testing";
import { SuspendController } from "./suspend.controller";
import { SuspendService } from "./suspend.service";
import { SuspendStudentDto } from "../dto/suspend-student.dto";

const suspendStudentDto: SuspendStudentDto = {
  student: "student1@test.com",
};

describe("SuspendController", () => {
  let suspendController: SuspendController;
  let suspendService: SuspendService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SuspendController],
      providers: [
        {
          provide: SuspendService,
          useValue: {
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    suspendController = app.get<SuspendController>(SuspendController);
    suspendService = app.get<SuspendService>(SuspendService);
  });

  it("should be defined", () => {
    expect(suspendController).toBeDefined();
  });

  describe("update()", () => {
    it("should call suspendService.update", async () => {
      await suspendController.update(suspendStudentDto);
      expect(suspendService.update).toHaveBeenCalled();
      expect(suspendService.update).toHaveBeenCalledWith(suspendStudentDto);
    });
  });
});
