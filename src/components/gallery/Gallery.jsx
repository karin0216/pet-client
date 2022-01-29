import React, { useState } from "react";
import "../../styles/gallery/gallery.scss";
const { REACT_APP_SERVER_URL } = process.env;

const Gallery = ({ petImg }) => {
  //current index of the image
  const [currImg, setCurrImg] = useState(0);
  //state of the screen if you will view the image in full screen or not
  const [fullScreen, setFullScreen] = useState(false);

  const openImg = (i) => {
    setCurrImg(i);
    setFullScreen(true);
  };

  return (
    <>
      <div className={`fullScreenImg ${fullScreen === true && "hideImage"}`}>
        {petImg.length && (
          <img
            src={`${REACT_APP_SERVER_URL}/pics/${petImg[currImg]}`}
            alt="img"
          />
        )}

        <i className="fa fa-close" onClick={() => setFullScreen(false)}></i>
      </div>
      <section className="gallerySection">
        {petImg.length &&
          petImg.map((img, i) => (
            <img
              src={`${REACT_APP_SERVER_URL}/pics/${img}`}
              alt="pet"
              onClick={() => openImg(i)}
              key={i}
            />
          ))}
      </section>
    </>
  );
};

export default Gallery;
