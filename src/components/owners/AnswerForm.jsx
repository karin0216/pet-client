import React from "react";
import axios from "axios";
import { socket } from "../../socket";
const { REACT_APP_SERVER_URL } = process.env;

const AnswerForm = ({
  answerFormRef,
  setCurrentRequest,
  currentRequest,
  getRequests,
}) => {
  const closeAnswerForm = () => {
    setCurrentRequest({});
    answerFormRef.current.classList.remove("showAnswerForm");
  };
  const requestAction = async (action) => {
    try {
      await axios.patch(
        `${REACT_APP_SERVER_URL}/requests/${action}`,
        {
          user_id: currentRequest._id,
          request_id: currentRequest.request._id,
          action,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      );
      if (action === "Approved") {
        await axios.post(
          `${REACT_APP_SERVER_URL}/messages/conversations`,
          { user_id: currentRequest._id },
          {
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
          }
        );
      }
      await getRequests();
      closeAnswerForm();
      //       pet_id
      // :
      // "619a3bf5d0f2f593b14bc0a8"
      // pet_name
      // :
      // "brook"
      // start
      // :
      // 2022-01-11T03:00:00.000+00:00
      // end
      // :
      // 2022-01-12T03:00:00.000+00:00
      // status
      // :
      // "Approved"
      socket.emit("notifyRequest", {
        user_id: currentRequest._id,
        request: {
          ...currentRequest.request,
          status: action,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="answerFormContainer" ref={answerFormRef}>
      <div className="form">
        <i className="fa fa-close" onClick={closeAnswerForm}></i>
        <h1>Answers</h1>
        <ol>
          {currentRequest.request &&
            currentRequest.request.questionnaire.map((qa, i) => (
              <li>
                <h2>{qa.question}</h2>
                <p>{qa.answer}</p>
              </li>
            ))}
        </ol>
        <div className="answerFormButtons">
          <button onClick={() => requestAction("Approved")}>Accept</button>
          <button onClick={() => requestAction("Rejected")}>Decline</button>
        </div>
      </div>
    </div>
  );
};

export default AnswerForm;
