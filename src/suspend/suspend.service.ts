import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Student } from "../models/student.model";
import { SuspendStudentDto } from "../dto/suspend-student.dto";

@Injectable()
export class SuspendService {
  constructor(
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
  ) {}

  async update(suspendStudentDto: SuspendStudentDto): Promise<string> {
    try {
      await this.studentModel.update(
        {
          isSuspended: true,
        },
        {
          where: {
            email: suspendStudentDto.student,
          },
        },
      );
      return "Success";
    } catch {
      return "Failed";
    }
  }
}
