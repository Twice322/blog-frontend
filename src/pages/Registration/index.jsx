import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useForm } from 'react-hook-form'
import styles from './Login.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { fetchRegister } from '../../redux/slices/auth';
import { isAuthSelector } from '../../redux/slices/auth';
import {Navigate } from 'react-router-dom'
export const Registration = () => {
  const isAuth = useSelector(isAuthSelector)
  const dispatch = useDispatch();

  const {register, handleSubmit, setError, formState: {errors, isValid}} = useForm({
    defaultValues: {
      fullName: "",
      email: '',
      password: ''
    },
    mode: 'onChange'
  })
  
  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values))
    if (!data.payload) {
      return alert('Не удалось зарегистрироваться')
    }

    if ("token" in data.payload) {
      window.localStorage.setItem("token", data.payload.token)
    }
  }
  if (isAuth) return <Navigate to="/"/>
  return (
    <Paper classes={{ root: styles.root }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography classes={{ root: styles.title }} variant="h5">
          Создание аккаунта
        </Typography>
        <div className={styles.avatar}>
          <Avatar sx={{ width: 100, height: 100 }} />
        </div>
        <TextField
          className={styles.field}
          label="Полное имя"
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register("fullName", {required: 'Укажите полное имя'})}
          fullWidth />
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register("email", {required: 'Укажите почту'})}
          fullWidth
          />
        <TextField 
        className={styles.field} 
        label="Пароль" 
        error={Boolean(errors.password?.message)}
        helperText={errors.password?.message}
        {...register("password", {required: 'Укажите пароль'})}
        fullWidth />
        <Button size="large" variant="contained" type='submit' fullWidth>
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
