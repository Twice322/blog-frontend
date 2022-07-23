import React from "react";
import styles from "./AddComment.module.scss";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import axios from '../../axios'
export const Index = ({user, postId}) => {
  const [text, setText] = React.useState('')

  const onSubmit = async () => {
    try {
      await axios.post(`/comments/${postId}`, {
        text
      })
    } catch (error) {
      alert("Произошла ошибка отправки комментария")
    }
    setText("")
  }
  const onChange = (e) => setText(e.target.value) 

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={user.avatarUrl}
        />
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            value={text}
            onChange={onChange}
            multiline
            fullWidth
          />
          <Button variant="contained" onClick={onSubmit}>Отправить</Button>
        </div>
      </div>
    </>
  );
};
