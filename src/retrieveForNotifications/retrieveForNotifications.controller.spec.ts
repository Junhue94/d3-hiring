import { Test, TestingModule } from "@nestjs/testing";
import { RetrieveForNotificationsController } from "./retrieveForNotifications.controller";
import { RetrieveForNotificationsService } from "./retrieveForNotifications.service";
import { RetrieveForNotificationsDto } from "../dto/retrieve-for-notifications.dto";

const retrieveForNotificationsDto: RetrieveForNotificationsDto = {
  teacher: "teacher@test.com",
  notification: "Hello students! @studentjon@test.com @studenthon@test.com",
};

describe("RetrieveForNotificationsController", () => {
  let retrieveForNotificationsController: RetrieveForNotificationsController;
  let retrieveForNotificationsService: RetrieveForNotificationsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RetrieveForNotificationsController],
      providers: [
        {
          provide: RetrieveForNotificationsService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    retrieveForNotificationsController =
      app.get<RetrieveForNotificationsController>(
        RetrieveForNotificationsController,
      );
    retrieveForNotificationsService = app.get<RetrieveForNotificationsService>(
      RetrieveForNotificationsService,
    );
  });

  it("should be defined", () => {
    expect(retrieveForNotificationsController).toBeDefined();
  });

  describe("get()", () => {
    it("should call retrieveForNotificationsService.get", async () => {
      await retrieveForNotificationsController.get(retrieveForNotificationsDto);
      expect(retrieveForNotificationsService.get).toHaveBeenCalled();
      expect(retrieveForNotificationsService.get).toHaveBeenCalledWith(
        retrieveForNotificationsDto,
      );
    });
  });
});
