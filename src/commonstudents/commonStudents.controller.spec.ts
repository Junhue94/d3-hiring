import { Test, TestingModule } from "@nestjs/testing";
import { CommonStudentsController } from "./commonStudents.controller";
import { CommonStudentsService } from "./commonStudents.service";
import { CommonStudentsQueryParamsDto } from "../dto/common-students-query-params.dto";

const commonStudentsQueryParamsDto: CommonStudentsQueryParamsDto = {
  teacher: "teacher@test.com",
};

describe("CommonStudentsController", () => {
  let commonStudentsController: CommonStudentsController;
  let commonStudentsService: CommonStudentsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CommonStudentsController],
      providers: [
        {
          provide: CommonStudentsService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    commonStudentsController = app.get<CommonStudentsController>(
      CommonStudentsController,
    );
    commonStudentsService = app.get<CommonStudentsService>(
      CommonStudentsService,
    );
  });

  it("should be defined", () => {
    expect(commonStudentsController).toBeDefined();
  });

  describe("get()", () => {
    it("should call commonStudentsService.get", async () => {
      await commonStudentsController.get(commonStudentsQueryParamsDto);
      expect(commonStudentsService.get).toHaveBeenCalled();
      expect(commonStudentsService.get).toHaveBeenCalledWith(
        commonStudentsQueryParamsDto,
      );
    });
  });
});
