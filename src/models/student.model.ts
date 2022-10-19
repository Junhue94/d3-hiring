import { Column, Model, Table, DataType } from "sequelize-typescript";
import { DatabaseEnum } from "../enum/database.enum";

@Table({
  tableName: DatabaseEnum.table.student.name,
  indexes: [
    {
      fields: [DatabaseEnum.table.student.column.email],
      unique: true,
    },
  ],
})
export class Student extends Model {
  @Column({
    field: DatabaseEnum.table.student.column.studentId,
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  studentId: number;

  @Column({
    field: DatabaseEnum.table.student.column.email,
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    field: DatabaseEnum.table.student.column.isSuspended,
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isSuspended: boolean;
}
