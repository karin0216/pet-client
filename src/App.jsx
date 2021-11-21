import { Routes, Route, HashRouter } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Step2 from "./pages/Step2";
import Step3Owner from "./pages/Step3Owner";
import Step3Carer from "./pages/Step3Carer";
import Step4 from "./pages/Step4";
import Step5 from "./pages/Step5";
import Messenger from "./pages/Messenger";
import { useEffect } from "react";
import { socket } from "./socket";
import Pet from "./pages/Pet";
import Questionnaire from "./pages/Questionnaire";
import Home from "./pages/Home";
import Navbar from "./components/navbar/Navbar";
import PetInfo from "./components/owners/PetInfo";
import Request from "./components/owners/Request";
import { useDispatch, useSelector } from "react-redux";
import { verifyTokenAction } from "./slicers/actions/userAction";
import PrivateRoute from "./hoc/PrivateRoute";
import Page404 from "./pages/Page404";
import Carer from "./components/carer/Carer";
import OwnerHome from "./components/owners/OwnerHome";
import GalleryPage from "./pages/GalleryPage";
import UpdateUserInfo from "./pages/UpdateUserInfo";
import CarerProfilePage from "./pages/CarerProfilePage";
import {
  addMessageAction,
  setSeenStateAction,
  signOutMessengerCleanUp,
} from "./slicers/messengerSlice";
import { getConversationsAction } from "./slicers/actions/messageActions";
import axios from "axios";

const { REACT_APP_SERVER_URL } = process.env;

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const type = useSelector((state) => state.user.type);
  const id = useSelector((state) => state.user._id);
  const currentChatUser = useSelector(
    (state) => state.messenger.currentChatUser
  );

  useEffect(() => {
    if (isLoggedIn === true) {
      socket.on("receiveMessage", async (data) => {
        console.log("1");
        dispatch(getConversationsAction());
        if (currentChatUser._id === data.sender_id) {
          dispatch(addMessageAction(data));
          dispatch(
            setSeenStateAction({
              conversation_id: data.conversation_id,
              user_id: data.receiver_id,
            })
          );
          await axios.post(
            `${REACT_APP_SERVER_URL}/messages/seen/${data.conversation_id}`,
            {},
            {
              headers: {
                "x-access-token": localStorage.getItem("token"),
              },
            }
          );
        }
      });
    }
    return () => {
      socket.off("receiveMessage");
    };
  }, [dispatch, currentChatUser, isLoggedIn]);

  useEffect(() => {
    (async () => {
      try {
        await dispatch(verifyTokenAction());
      } catch (error) {
        console.log(error);
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      try {
        if (isLoggedIn === true) await dispatch(getConversationsAction());
      } catch (error) {
        console.log(error);
      }
    })();

    return () => {
      dispatch(signOutMessengerCleanUp());
    };
  }, [dispatch, isLoggedIn]);
  useEffect(() => {
    if (isLoggedIn === true) {
      socket.connect();
      socket.emit("addUser", { user_id: id });
    }
    return () => {
      socket.disconnect();
    };
  }, [isLoggedIn, id]);

  const closeAnyNotif = (e) => {
    // document.querySelector(".notification").classList.remove("showNotif");
  };
  return (
    <div className="App" onMouseDown={closeAnyNotif}>
      <div className="background"></div>
      <HashRouter>
        <Navbar />
        <Routes>
          <Route path="" element={<Home />} />

          {/* owner pages only */}
          {type === "Owner" && (
            <Route
              path="/owner"
              element={
                <PrivateRoute>
                  <OwnerHome />
                </PrivateRoute>
              }>
              <Route exact path="/owner" element={<PetInfo />} />
              <Route exact path="/owner/requests" element={<Request />} />
            </Route>
          )}

          {/* carer pages only */}
          {/* might be worng spelling */}
          {type === "Carer" && (
            <Route path="/carer">
              <Route
                path="/carer/"
                element={
                  <PrivateRoute>
                    <Carer />
                  </PrivateRoute>
                }
              />
              <Route
                path="/carer/pet/:id"
                element={
                  <PrivateRoute>
                    <Pet />
                  </PrivateRoute>
                }
              />
              <Route
                path="/carer/questionnaire"
                element={
                  <PrivateRoute>
                    <Questionnaire />
                  </PrivateRoute>
                }
              />
              <Route
                path="/carer/profile"
                element={
                  <PrivateRoute>
                    <CarerProfilePage />
                  </PrivateRoute>
                }
              />
            </Route>
          )}

          {/* both user can access this */}

          <Route
            path="/messenger"
            element={
              <PrivateRoute>
                <Messenger />
              </PrivateRoute>
            }
          />
          <Route
            path="/gallery/:id"
            element={
              <PrivateRoute>
                <GalleryPage />
              </PrivateRoute>
            }
          />
          <Route
            //change to --> path="setting/:id" after we get user_id in redux
            path="/setting"
            element={
              <PrivateRoute>
                <UpdateUserInfo />
              </PrivateRoute>
            }
          />
          {/* anyone can access this */}
          <Route exact path="/signin" element={<SignIn />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/step2" element={<Step2 />} />
          <Route exact path="/step3/owner" element={<Step3Owner />} />
          <Route exact path="/step3/carer" element={<Step3Carer />} />
          <Route exact path="/step4" element={<Step4 />} />
          <Route exact path="/step5" element={<Step5 />} />
          <Route exact path="*" element={<Page404 />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
