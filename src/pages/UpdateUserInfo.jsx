import React, { useState } from "react";
import "../styles/update.scss";
import { updateUserInfo } from "../slicers/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const UpdateUserInfo = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const _id = useSelector((state) => state.user._id);
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    username: Yup.string(),
    email: Yup.string().email("Email is invalid"),
    password: Yup.string().min(6, "Min is 6"),
    description: Yup.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, dirtyFields },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    console.log(isDirty);
    console.log(dirtyFields);

    const modifyData = () => {
      let dirtyData = {};
      for (let originalKey in data) {
        for (let dirtyKey in dirtyFields) {
          if (originalKey === dirtyKey) {
            dirtyData[originalKey] = data[originalKey];
          }
        }
      }
      return dirtyData;
    };

    const modifiedData = modifyData();
    console.log(modifiedData);
    console.log(data);
    console.log(typeof modifiedData);
    console.log(typeof data);

    const updateUserAction = await dispatch(
      updateUserInfo({ _id, modifiedData })
    );
    if (updateUserAction.payload.err) {
      setErrorMessage("Accout update is falied");
    } else {
      setSuccessMessage("Account is successfully updated");
    }
  };

  return (
    <main style={{ marginTop: 200 }}>
      <h1>Edit profile</h1>
      <div>{errorMessage ? errorMessage : successMessage}</div>
      <div className="update">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="username"
            onChange
            {...register("username")}
          />
          <div>{errors.username?.message}</div>
          <input type="text" placeholder="email" {...register("email")} />
          <div>{errors.email?.message}</div>
          <input
            type="password"
            placeholder="password"
            {...register("password")}
          />
          <div>{errors.password?.message}</div>
          <input type="type" placeholder="Bio" {...register("description")} />
          {/* <input
            type="file"
            placeholder="profile picture"
            {...register("profile_picture")}
          /> */}
          <button>Save</button>
        </form>
      </div>
    </main>
  );
};

export default UpdateUserInfo;
