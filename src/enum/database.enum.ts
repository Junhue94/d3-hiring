export const DatabaseEnum = {
  table: {
    teacher: {
      name: "teacher",
      column: {
        teacherId: "teacher_id",
        email: "email",
      },
    },
    student: {
      name: "student",
      column: {
        studentId: "student_id",
        email: "email",
        isSuspended: "is_suspended",
      },
    },
    teacher_student: {
      name: "teacher_student",
      column: {
        teacherStudentId: "teacher_student_id",
        teacherId: "teacher_id",
        studentId: "student_id",
      },
    },
  },
};
