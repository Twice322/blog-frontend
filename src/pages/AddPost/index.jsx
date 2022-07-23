import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import axios from '../../axios'
import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useSelector } from 'react-redux';
import { isAuthSelector } from '../../redux/slices/auth';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { useRef } from 'react';


export const AddPost = () => {
  const [text, setText] = React.useState('');
  const {id} = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState(null)
  const inputRef = useRef()
  const isEditing = Boolean(id)
  const [isLoading, setLoading] = React.useState(false)

  const isAuth = useSelector(isAuthSelector)
  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData()
      formData.append("image", event.target.files[0])
      const {data} = await axios.post('/upload', formData)
      setImageUrl(data.url)
    } catch (error) {
      console.log(error)
      alert('ошибка загрузки файлов')
    }
  };

  const onClickRemoveImage = async (event) => {
    setImageUrl('')
  };
  const onSubmit = async () => {
    try {
      setLoading(true)
      const fields = {
        title, 
        imageUrl,
        tags,
        text
      } 
      const {data} = isEditing ? await axios.patch(`/posts/${id}`, fields) :
      await axios.post('/posts', fields)

      const _id = isEditing ? id: data._id
      
      navigate(`/posts/${_id}`)
    } catch (error) {
      console.log(error)
    }
  }
  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);
  React.useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`).then(({data} )=> {
        setTitle(data.title)
        setText(data.text)
        setImageUrl(data.imageUrl)
        setTags(data.tags.join(','))
      }).catch(error => {
        alert("Ошибка при получении статьи")
      })
    }
  }, [])
  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );
  if (!window.localStorage.getItem("token") && !isAuth){
    return <Navigate to={'/'}/>;
  }
  return (
    <Paper style={{ padding: 30 }}>
      <Button variant="outlined" size="large" onClick={() => inputRef.current.click()}>
        Загрузить превью
      </Button>
      <input type="file" onChange={handleChangeFile} hidden ref={inputRef}/>
      {imageUrl && (
          <>
            <Button variant="contained" color="error" onClick={onClickRemoveImage}>
              Удалить
            </Button>
            <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
          </>
      )}

      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        fullWidth
      />
      <TextField 
      classes={{ root: styles.tags }} 
      variant="standard" 
      placeholder="Тэги" 
      value={tags}
      onChange={e => setTags(e.target.value)}
      fullWidth />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button size="large" variant="contained" onClick={onSubmit}>
          {isEditing ? "Сохранить" : "Опубликовать"}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
