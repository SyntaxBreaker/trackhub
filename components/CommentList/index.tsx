import { Avatar, Box, Typography, IconButton, Alert } from "@mui/material";
import IComment from "../../types/comment";
import ClearIcon from "@mui/icons-material/Clear";
import { useUser } from "@auth0/nextjs-auth0/client";
import axios from "axios";
import { useState } from "react";

export default function CommentList({ comments }: { comments: IComment[] }) {
	const [error, setError] = useState({ message: "", id: "" });

	const { user } = useUser();

	const handleDeleteComment = (id: string) => {
		axios
			.delete(`/api/comments/delete/${id}`)
			.then((res) => {
				setError({
					message: "",
					id: "",
				});
			})
			.catch((err) =>
				setError({
					message: err.message,
					id: id,
				})
			);
	};

	return (
		<Box sx={{ margin: "36px auto 16px" }}>
			{comments.map((comment) => (
				<Box
					key={comment.id}
					sx={{
						marginTop: 2,
						p: 1,
						boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
						borderRadius: 2,
					}}
				>
					<Box
						sx={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
						}}
					>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
							}}
						>
							<Avatar src={comment.authorAvatar} />
							<Typography variant="body1">{comment.authorName}</Typography>
						</Box>
						{user?.email === comment.authorId && (
							<IconButton onClick={() => handleDeleteComment(comment.id)}>
								<ClearIcon />
							</IconButton>
						)}
					</Box>
					<Typography variant="body1" color="text.secondary" sx={{ wordBreak: "break-word", marginTop: 1 }}>
						{comment.text}
					</Typography>
					{error.id === comment.id && error.message.length > 0 && (
						<Alert severity="error" sx={{ marginTop: 2 }}>
							{error.message}
						</Alert>
					)}
				</Box>
			))}
		</Box>
	);
}
