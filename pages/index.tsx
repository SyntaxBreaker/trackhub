import { Avatar, AvatarGroup, Box, Button, Card, CardContent, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ITask from '../types/task';
import { calculateRemainingDays } from '../utils/date';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function Home({ tasks }: { tasks: ITask[] }) {
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '16px' }}>
        <Typography variant='h5'>Recent Tasks ({tasks.length})</Typography>
        <Button component={Link} href="/add" startIcon={<AddIcon />} variant="contained" color="primary">New task</Button>
      </Box>
      <Grid container spacing={4} direction="row">
        {tasks.map(task => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={task.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 12 }} color="text.secondary">
                    <AccessTimeIcon color="warning" sx={{ fontSize: 12, verticalAlign: 'text-top' }} /> Due in {calculateRemainingDays(task.deadline)} days
                  </Typography>
                  <IconButton>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography variant="h5" component="h3" sx={{ marginTop: 1 }}>{task.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', marginTop: 1 }}>{task.description}</Typography>
                <AvatarGroup sx={{ justifyContent: 'flex-end', marginTop: 2 }}>
                  <Tooltip title={task.authorName} arrow>
                    <Avatar src={task.authorAvatar} alt={task.authorName} sx={{ width: 24, height: 24 }} />
                  </Tooltip>
                </AvatarGroup>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const session = await getSession(ctx.req, ctx.res);
    const prisma = new PrismaClient();

    const tasks = await prisma.task.findMany(
      {
        where: {
          authorId: session?.user.email
        }
      }
    );

    return {
      props: {
        tasks
      }
    }
  },
});

export default Home