import React, { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Post from '../../components/Post';
import SaveIcon from '@mui/icons-material/Save';
import useEth from "../../contexts/EthContext/useEth";
import { CircularProgress, Typography } from '@mui/material';


const Home = ({ open, setOpen }) => {
    const { state: { contract, accounts, initialized } } = useEth();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [posts, setPosts] = useState([]);
    const [creating, setCreating] = useState(false);
    const [loading, setLoading] = useState(true);

    const createPost = async () => {
        setCreating(true);
        try {
            await contract.methods.createPost(title, content).send({ from: accounts[0] });
            setTitle('');
            setContent('');
            setOpen(false);
            getPosts();
        } catch (error) {
            console.log(error);
        }
        setCreating(false);
    }

    const getPosts = async () => {
        setLoading(true);
        try {
            const res = await contract.methods.getPosts().call();
            const postsList = res.map(post => {
                return {
                    id: post.id,
                    title: post.title,
                    content: post.content,
                    author: post.creator
                }
            });
            setPosts(postsList);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    useEffect(() => {
        if (initialized) {
            getPosts();
        }
    }, [initialized]);

    return (loading ?
        <Stack height='90vh' alignItems='center' justifyContent='center' ><CircularProgress /></Stack> :
        <React.Fragment>
            <Stack spacing={2} padding={4}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12, lg: 16, xl: 20 }}>
                        {posts.map(post => {
                            return <Grid item xs={2} sm={4} md={4} lg={4} xl={4} key={post.id}><Post post={post} /></Grid>
                        })}
                    </Grid>
                </Box>
            </Stack>
            <Drawer
                anchor={'right'}
                open={open}
                onClose={(e) => setOpen(false)}
            >
                <Stack spacing={2} padding={2}>
                    <Typography variant='h4'>Create New Post</Typography>
                    <TextField
                        id="title"
                        label="Title"
                        type="text"
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        id="content"
                        label="Body"
                        type="text"
                        variant="outlined"
                        maxRows={15}
                        rows={5}
                        multiline
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <LoadingButton
                        color="secondary"
                        onClick={createPost}
                        loading={creating}
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                        variant="contained"
                        size='large'
                    >
                        Add New Post
                    </LoadingButton>
                </Stack>
            </Drawer>
        </React.Fragment>

    )
}

export default Home