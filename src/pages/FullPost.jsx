import React from "react";
import { useParams } from "react-router-dom";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "../axios";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { fetchCommentsByPostId } from "../redux/slices/comments";
import socket from "../core/socket";

export const FullPost = () => {
  const [data, setData] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const dispatch = useDispatch()
  const { id } = useParams()
  const { comments } = useSelector(state => state.comments)
  const userData = useSelector(state => state.auth.data)
  React.useEffect(() => {
    axios.get(`/posts/${id}`).then(res => {
      setData(res.data)
      setIsLoading(false)
    }).catch((error)=> {
      console.log(error)
      alert("Ошибка при получении статьи")
    })
    dispatch(fetchCommentsByPostId(id))

    
    socket.on('SERVER:NEW_COMMENT_CREATE', () => {
      dispatch(fetchCommentsByPostId(id))
    })

    return () => socket.removeListener('SERVER:NEW_COMMENT_CREATE', () => dispatch(fetchCommentsByPostId(id)))



  }, [])
  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost/>
  }
  return (
    <>
      <Post
        _id={data._id}
        title={data.title}
        imageUrl={`http://localhost:4444${data?.imageUrl}`}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={comments.length}
        tags={data.tags}
      >
        <ReactMarkdown children={data.text}/>
      </Post>
      {comments && (
        <CommentsBlock
          items={comments}
          isLoading={false}

        >
          <Index 
          user={userData}
          postId={id} 
           />
        </CommentsBlock>
      )}
    </>
  );
};
