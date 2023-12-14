import { IMessage } from "../../types/chat";

function Message({ message }: { message: IMessage }) {
  return <div>{message.text}</div>;
}

export default Message;
