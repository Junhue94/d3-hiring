import { Body, Controller, Post } from "@nestjs/common";
import { RegisterTeacherToStudentsDto } from "../dto/register-teacher-to-students.dto";
import { RegisterService } from "./register.service";

@Controller("api/register")
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  create(
    @Body() registerTeacherToStudentsDto: RegisterTeacherToStudentsDto,
  ): Promise<string> {
    return this.registerService.create(registerTeacherToStudentsDto);
  }
}
