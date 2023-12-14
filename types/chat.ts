import IProject from "./project";

interface IMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  chatId: string;
}

interface IChat {
  id: string;
  projectId: string;
  messages: IMessage[];
  Project: IProject;
}

export type { IMessage, IChat };
