import { Controller, HttpCode, Post, Body } from "@nestjs/common";
import { SuspendService } from "./suspend.service";
import { SuspendStudentDto } from "../dto/suspend-student.dto";

@Controller("api/suspend")
export class SuspendController {
  constructor(private readonly suspendService: SuspendService) {}

  @Post()
  @HttpCode(204)
  update(@Body() suspendStudentDto: SuspendStudentDto): Promise<string> {
    return this.suspendService.update(suspendStudentDto);
  }
}
