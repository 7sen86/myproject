import type { Booklet, Subject, Stage, Teacher } from "@prisma/client";

export type BookletWithRelations = Booklet & {
  subject: Subject;
  stage: Stage;
  teacher: Teacher;
};
