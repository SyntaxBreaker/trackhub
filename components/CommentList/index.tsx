import { Avatar, Box, Paper, Typography } from "@mui/material";
import IComment from "../../types/comment";

export default function CommentList({ comments }: { comments: IComment[] }) {
    return (
        <Box sx={{ width: '350px', margin: '36px auto 16px' }}>
            {comments.map(comment => (
                <Paper key={comment.id} elevation={3} sx={{ display: 'flex', gap: '16px', marginTop: '16px', p: 1 }}>
                    <Avatar src={comment.authorAvatar} sx={{ alignSelf: 'center' }} />
                    <Box>
                        <Typography variant="subtitle1">{comment.authorName}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>{comment.text}</Typography>
                    </Box>
                </Paper>
            ))}
        </Box>
    )
}