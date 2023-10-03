import { useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import ProjectForm from "../../components/ProjectForm";
import Head from "next/head";
import { Box } from "@mui/material";

export default function Create() {
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) window.location.href = "/api/auth/login";
  }, [user, isLoading]);

  return (
    <>
      <Head>
        <title>Create a new project</title>
      </Head>
      <Box sx={{ marginTop: "32px" }}>
        <ProjectForm user={user} method="POST" />
      </Box>
    </>
  );
}
