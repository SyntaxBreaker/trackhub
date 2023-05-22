import { useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import TaskForm from "../../../../components/TaskForm";

export default function Create() {
    const { user, isLoading } = useUser();

    useEffect(() => {
        if (!isLoading && !user) window.location.href = '/api/auth/login';
    }, [user, isLoading]);

    return (
        <TaskForm
            user={user}
            method="POST"
        />
    )
}