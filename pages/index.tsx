import { Box, Button, IconButton, Typography } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { PrismaClient } from "@prisma/client";
import IProject from "../types/project";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Link from "next/link";
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function Home({ projects }: { projects: IProject[] }) {
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) window.location.href = '/api/auth/login';
  }, [user, isLoading]);

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h2">
          Project list:
        </Typography>
        <Button component={Link} href="/projects/create" startIcon={<AddIcon />} variant="contained" color="primary">New project</Button>
      </Box>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Creator</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map(project => (
              <TableRow key={project.id}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>{project.creator}</TableCell>
                <TableCell align="right">
                  <IconButton>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const session = await getSession(ctx.req, ctx.res);
    const prisma = new PrismaClient();

    const projects = await prisma.project.findMany(
      {
        where: {
          creator: session?.user.email
        }
      }
    );

    return {
      props: {
        projects
      }
    }
  },
});

export default Home