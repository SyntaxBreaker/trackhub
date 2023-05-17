import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ITask from '../types/task';
import { calculateRemainingDays } from '../utils/date';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';

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
                <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
                  <AccessTimeIcon color="warning" sx={{ fontSize: 12, verticalAlign: 'text-top' }} /> Due in {calculateRemainingDays(task.deadline)} days
                </Typography>
                <Typography variant="h5" component="h3" gutterBottom>{task.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical' }}>{task.description}</Typography>
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