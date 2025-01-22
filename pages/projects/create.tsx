import { useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import ProjectForm from "../../components/ProjectForm";
import Head from "next/head";

export default function Create() {
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) window.location.href = "/api/auth/login";
  }, [user, isLoading]);

  return (
    <>
      <Head>
        <title>TrackHub | Create a new project</title>
      </Head>
      <ProjectForm user={user} method="POST" />
    </>
  );
}
