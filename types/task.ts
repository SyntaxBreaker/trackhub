import IComment from "./comment";
import IProject from "./project";

export default interface ITask {
  authorId: string;
  authorName: string;
  authorAvatar: string;
  deadline: string;
  description: string;
  id: string;
  name: string;
  projectId: string;
  status: "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  comments: IComment[];
  assignedUser?: string;
  Project: IProject;
  duration: number;
}
