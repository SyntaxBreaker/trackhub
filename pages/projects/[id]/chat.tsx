import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import ProjectChat from "../../../components/ProjectChat";
import { IChat } from "../../../types/chat";
import axios from "axios";
import Head from "next/head";

export default function Chat({
  chat: chatProps,
  isAuthorised,
}: {
  chat?: IChat;
  isAuthorised: boolean;
}) {
  return (
    <>
      <Head>
        <title>TrackHub | Project Chat</title>
      </Head>
      {isAuthorised && chatProps && <ProjectChat chat={chatProps} />}
    </>
  );
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    try {
      const { id } = ctx.query;
      const session = await getSession(ctx.req, ctx.res);
      let { data } = await axios.post(
        `${process.env.BASE_URL}/api/chat/${id}`,
        {
          email: session?.user.email,
        }
      );

      return {
        props: {
          ...data,
        },
      };
    } catch (err) {
      return {
        props: {
          isAuthorised: false,
          chat: [],
        },
      };
    }
  },
});
