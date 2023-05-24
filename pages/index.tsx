import { Box, Button, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Fragment, useEffect, useState } from "react";
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
import { useRouter } from "next/router";
import axios from "axios";

function Home({ projects }: { projects: IProject[] }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<IProject | null>(null);

  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push('/api/auth/login');
  }, [user, isLoading]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, item: IProject) => {
    setAnchorEl(e.currentTarget);
    setSelectedItem(item);
  }

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  }

  const handleDeleteProject = () => {
    axios.delete(`/api/projects/delete/${selectedItem?.id}`, {
      
  })
      .then(res => {
          console.log(res);
          router.push('/');
      })
      .catch(err => console.log(err))
  }

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
              <Fragment key={project.id}>
                <TableRow>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{project.creator}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(e) => handleClick(e, project)}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
                <Menu
                  open={Boolean(anchorEl) && selectedItem === project}
                  onClose={handleClose}
                  anchorEl={anchorEl}
                >
                  <MenuItem
                    onClick={() => {
                      handleClose()
                      router.push(`projects/${project.id}/tasks`)
                    }}
                  >
                    Go to Project
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose()
                      router.push(`projects/${project.id}/edit`)
                    }}
                  >
                    Edit project
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose()
                      handleDeleteProject()
                    }}
                  >
                    Delete project
                  </MenuItem>
                </Menu>
              </Fragment>
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