import React, { useEffect, useState } from 'react'
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import LoadingButton from '@mui/lab/LoadingButton';
import Post from '../../components/Post';
import SaveIcon from '@mui/icons-material/Save';
import useEth from "../../contexts/EthContext/useEth";
import { CircularProgress, Typography } from '@mui/material';



function storageClient() {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEZFQzM2NTIwOUEwMzU3NzRCRTUyQzkyYUVGNjczYjc4YmE1YTgxYTkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTgyOTU0MDI2MjYsIm5hbWUiOiJibG9nLWFwcC1hcGkifQ.Y4yUYhX1MmMriLV229lE3lkr4Hciu-XtLtEr-dzQeEw";
    return new Web3Storage({ token: token })
}

const Home = ({ open, setOpen }) => {

    const { state: { contract, accounts, initialized } } = useEth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [posts, setPosts] = useState([]);
    const [creating, setCreating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState(null);

    // Function to create a new post
    const createPost = async () => {
        setCreating(true);
        try {
            let cid = "";
            if (images && images !== null) {
                const client = storageClient();
                cid = await client.put(images);
            }
            await contract.methods.createPost(title, content, cid).send({ from: accounts[0] });
            setTitle('');
            setContent('');
            setOpen(false);
            getPosts();
        } catch (error) {
            console.log(error);
        }
        setCreating(false);
    }

    // Function to get all posts
    const getPosts = async () => {
        setLoading(true);
        try {
            const res = await contract.methods.getPosts().call();
            const postsList = [];

            for (const post of res) {
                let img = '';
                if (post.image !== '') {
                    const client = storageClient();
                    const r = await client.get(post.image);
                    console.log(post.image);
                    console.log(r);
                    if (r.ok) {
                        // Unpacking File objects from the response
                        const files = await r.files()
                        console.log(files[0]);
                        img = files.length > 0 ? `https:/${post.image}.ipfs.dweb.link/${files[0].name}` : '';
                    }
                }

                postsList.push(
                    {
                        id: post.id,
                        title: post.title,
                        content: post.content,
                        image: img,
                        author: post.creator
                    }
                )
            }
            setPosts([...postsList]);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    // Use Effect to call the getPosts function
    // Whenever the contract is initialized
    useEffect(() => {
        if (initialized) {
            getPosts();
        }
    }, [initialized]);

    // Returnung the Html elements
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
                        rows={5}
                        multiline
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <input type='file' onChange={(e) => setImages(e.target.files)} multiple />
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