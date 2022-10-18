import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { DatabaseEnum } from "../enum/database.enum";
import { Teacher } from "./teacher.model";
import { Student } from "./student.model";

@Table({
  tableName: DatabaseEnum.table.teacher_student.name,
  indexes: [
    {
      fields: [
        DatabaseEnum.table.teacher_student.column.teacherId,
        DatabaseEnum.table.teacher_student.column.studentId,
      ],
      unique: true,
    },
  ],
})
export class TeacherStudent extends Model {
  @Column({
    field: DatabaseEnum.table.teacher_student.column.teacherStudentId,
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  teacherStudentId: number;

  @Column({
    field: DatabaseEnum.table.teacher_student.column.teacherId,
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ForeignKey(() => Teacher)
  teacherId: number;

  @Column({
    field: DatabaseEnum.table.teacher_student.column.studentId,
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ForeignKey(() => Student)
  studentId: string;

  @BelongsTo(() => Teacher)
  teacher: Teacher;

  @BelongsTo(() => Student)
  student: Student;
}
