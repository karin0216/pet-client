import React, { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { useSelector } from "react-redux";
import PetSchedule from "./PetSchedule";
import Tags from "../Tag";
const { REACT_APP_SERVER_URL } = process.env;

const PetInfo = () => {
  const user = useSelector((state) => state.user);
  const [ownersPet, setOwnersPet] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const pet = await axios.get(`${REACT_APP_SERVER_URL}/pet/owner`, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        });
        setOwnersPet(pet.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [user]);

  const showTags = () => {
    if (ownersPet.tag) {
      return (
        <div className="tags">
          <Tags tags={ownersPet.tag} />
        </div>
      );
    } else {
      return <span>No tags</span>;
    }
  };

  return (
    <section className="homeSection">
      <figure className="petPic">
        {ownersPet.pet_pictures && (
          <img
            src={`${REACT_APP_SERVER_URL}/pics/${ownersPet.pet_pictures[0]}`}
            alt="Pet"
          ></img>
        )}
      </figure>
      <div className="petSchedule">
        <section className="petInfo">
          <h2>{ownersPet.name}</h2>
          <p className="summaryTitle">Bio:</p>
          <p className="summary">{ownersPet.description}</p>

          {showTags()}
        </section>
        <PetSchedule />
      </div>
    </section>
  );
};

export default PetInfo;
