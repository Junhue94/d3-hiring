import { Column, Model, Table, DataType } from "sequelize-typescript";
import { DatabaseEnum } from "../enum/database.enum";

@Table({
  tableName: DatabaseEnum.table.teacher.name,
  indexes: [
    {
      fields: [DatabaseEnum.table.teacher.column.email],
      unique: true,
    },
  ],
})
export class Teacher extends Model {
  @Column({
    field: DatabaseEnum.table.teacher.column.teacherId,
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  teacherId: number;

  @Column({
    field: DatabaseEnum.table.teacher.column.email,
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;
}
