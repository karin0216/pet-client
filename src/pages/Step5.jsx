import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../slicers/userSlice";
import { petDataStore } from "../slicers/petSlice";
import axios from "axios";
import QuestionForm from "../components/owners/QuestionForm";
import "../styles/registration/step5.scss";

const { REACT_APP_SERVER_URL } = process.env;

export default function Step5() {
  const dispatch = useDispatch();
  const userSignUpInfo = useSelector((state) => state.user);
  const petSignUpInfo = useSelector((state) => state.pet.info);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const currentQuestionRef = useRef();

  useEffect(() => {
    if (questions.length > 0) {
      if (currentQuestionRef.current) {
        currentQuestionRef.current.scrollIntoView();
      }
    }
  }, [questions]);

  const updateQuestions = (newQuestions) => {
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitPic = async (imageInput) => {
      try {
        const formData = new FormData();
        formData.append("file", imageInput);

        const response = await axios.post(
          `${REACT_APP_SERVER_URL}/pic/upload`,
          formData
        );
        return response.data[0].filename;
      } catch (err) {
        console.log(err);
      }
    };

    const submitPicForPet = async (imageInput) => {
      try {
        const formData = new FormData();
        [...imageInput].forEach((image) => {
          formData.append("file", image);
          formData.append("name", Date.now() + image.name);
        });
        const response = await axios.post(
          `${REACT_APP_SERVER_URL}/pic/upload`,
          formData
        );

        return response.data.map((res) => res.filename);
      } catch (err) {
        console.log(err);
      }
    };

    const userProfilePic = await submitPic(userSignUpInfo.profile_picture);
    const submitAction = await dispatch(
      signUp({
        username: userSignUpInfo.username,
        email: userSignUpInfo.email,
        password: userSignUpInfo.password,
        description: userSignUpInfo.description,
        profile_picture: userProfilePic,
        type: userSignUpInfo.type,
      })
    );
    const petPic = await submitPicForPet(petSignUpInfo.pet_pictures);

    const questionPayload = {
      questionnaire: questions.map((obj) => obj.text),
    };
    const petDataStoreAction = await dispatch(
      petDataStore({
        type: petSignUpInfo.type,
        name: petSignUpInfo.name,
        owner_id: submitAction.payload.user._id,
        description: petSignUpInfo.description,
        pet_pictures: petPic,
        questionnaire: questionPayload.questionnaire,
        tag: petSignUpInfo.tag,
      })
    );

    if (submitAction.payload.user && petDataStoreAction.payload.name) {
      navigate("/");
    }
  };

  return (
    <main className="step5Main">
      <form className="ste5MainForm" onSubmit={handleSubmit}>
        <h2>Questionnaire</h2>
        <QuestionForm
          questions={questions}
          updateQuestions={updateQuestions}
          currentQuestionRef={currentQuestionRef}
        />
        <button
          disabled={questions.length === 0}
          style={
            questions.length === 0
              ? { pointerEvents: "none", opacity: 0.4 }
              : {}
          }>
          Submit
        </button>
        <Link to="/step4">Back</Link>
      </form>
    </main>
  );
}
