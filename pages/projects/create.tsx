import { useEffect } from "react"
import { useUser } from "@auth0/nextjs-auth0/client";
import ProjectForm from "../../components/ProjectForm";

export default function Create() {
    const { user, isLoading } = useUser();

    useEffect(() => {
        if (!isLoading && !user) window.location.href = '/api/auth/login'
    }, [user, isLoading]);

    return (
        <ProjectForm
            user={user}
            method="POST"
        />
    )
}