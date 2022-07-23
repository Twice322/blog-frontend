import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags } from '../redux/slices/posts';
import { useParams } from 'react-router-dom'
import { fetchAllComments } from '../redux/slices/comments';
import socket  from '../core/socket'

export const Home = () => {
  const dispatch = useDispatch()
  const { posts, tags } = useSelector(state => state.posts)
  const userData = useSelector(state => state.auth.data)

  const { topComments } = useSelector(state => state.comments)
  console.log(topComments)
  const { tag } = useParams()
  const isPostsLoading = posts.status === "loading"
  const isTagsLoading = tags.status === "loading"
  React.useEffect(() => {
    dispatch(fetchPosts())
    dispatch(fetchTags())
    dispatch(fetchAllComments())

    socket.on('SERVER:NEW_POST_CREATE', () => {
      dispatch(fetchPosts())
      dispatch(fetchTags())
    })
    return () => socket.removeListener('SERVER:NEW_POST_CREATE', () => {
      dispatch(fetchPosts())
      dispatch(fetchTags())
    })
  }, [])  
  const items = tag ? posts.items.filter(item => item.tags.includes(tag)): posts.items
  

  return ( 
    <>
      <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
        <Tab label="Статьи" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : items).map((obj, index) => isPostsLoading ?
           (<Post key={index}
             isLoading={true}/>) : (
            <Post
              _id={obj._id}
              title={obj.title}
              imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}`: ''}
              user={obj.user}
              createdAt={obj.createdAt}
              viewsCount={obj.viewsCount}
              commentsCount={obj.commentsCount}
              tags={obj.tags}
              isEditable={userData?._id === obj.user._id}
              
            />
          ))}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={topComments}
            isLoading={false}
            showCount={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
