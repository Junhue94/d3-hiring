import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { RetrieveForNotificationsDto } from "../dto/retrieve-for-notifications.dto";
import { RetrieveForNotificationsResultDto } from "../dto/retrieve-for-notifications-result.dto";
import { TeacherStudent } from "../models/teacher_student.model";
import { Teacher } from "../models/teacher.model";
import { Student } from "../models/student.model";

@Injectable()
export class RetrieveForNotificationsService {
  constructor(
    @InjectModel(TeacherStudent)
    private readonly teacherStudentModel: typeof TeacherStudent,

    @InjectModel(Teacher)
    private readonly teacherModel: typeof Teacher,

    @InjectModel(Student)
    private readonly studentModel: typeof Student,
  ) {}

  async get(
    retrieveForNotificationsDto: RetrieveForNotificationsDto,
  ): Promise<RetrieveForNotificationsResultDto> {
    const studentEmail = this.extractEmails(
      retrieveForNotificationsDto.notification,
    );

    const result = await this.teacherStudentModel.findAll({
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

    return {
      recipients: result.map((ele) => ele["student.email"]),
    };
  }

  extractEmails(notification: string) {
    return notification.match(
      /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi,
    );
  }
}
