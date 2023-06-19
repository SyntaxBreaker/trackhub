import { Avatar, Box, Paper, Typography } from "@mui/material";
import IComment from "../../types/comment";

export default function CommentList({ comments }: { comments: IComment[] }) {
    return (
        <Box sx={{ margin: '36px auto 16px' }}>
            {comments.map(comment => (
                <Box key={comment.id} sx={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 2, p: 1, boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                        <Avatar src={comment.authorAvatar} />
                        <Typography variant="body1">{comment.authorName}</Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ wordBreak: 'break-word' }}>{comment.text}</Typography>
                </Box>
            ))}
        </Box>
    )
}