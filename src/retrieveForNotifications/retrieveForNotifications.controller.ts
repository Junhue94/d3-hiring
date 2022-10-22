import { Controller, HttpCode, Post, Body } from "@nestjs/common";
import { RetrieveForNotificationsService } from "./retrieveForNotifications.service";
import { RetrieveForNotificationsDto } from "../dto/retrieve-for-notifications.dto";
import { RetrieveForNotificationsResultDto } from "../dto/retrieve-for-notifications-result.dto";

@Controller("api/retrievefornotifications")
export class RetrieveForNotificationsController {
  constructor(
    private readonly retrieveForNotificationsService: RetrieveForNotificationsService,
  ) {}

  @Post()
  @HttpCode(200)
  get(
    @Body() retrieveForNotificationsDto: RetrieveForNotificationsDto,
  ): Promise<RetrieveForNotificationsResultDto> {
    return this.retrieveForNotificationsService.get(
      retrieveForNotificationsDto,
    );
  }
}
