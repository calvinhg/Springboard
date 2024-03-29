import React, { useState } from "react";
import "./Carousel.css";
import image1 from "./image1.jpg";
import image2 from "./image2.jpg";
import image3 from "./image3.jpg";
import Card from "./Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronLeft, faCircleChevronRight } from '@fortawesome/free-solid-svg-icons'

function Carousel(props) {
  const [cardIdx, setCardIdx] = useState(0);
  const [arrowLShow, setArrowLShow] = useState('hidden')
  const [arrowRShow, setArrowRShow] = useState('show')
  const card = props.cardData[cardIdx];
  const total = props.cardData.length;
  const goForward = () => {
    setCardIdx(cardIdx + 1);
    if (cardIdx + 2 === total) setArrowRShow('hidden')
    else setArrowLShow("visible")
  }
  const goBack = () => {
    setCardIdx(cardIdx - 1)
    if (cardIdx === 1) setArrowLShow('hidden')
    else setArrowRShow('visible')
  };

  return (
    <div className="Carousel">
      <h1>{props.title}</h1>
      <div className="Carousel-main">
        <i onClick={goBack} style={{visibility: arrowLShow}} data-testid="left-arrow">
          <FontAwesomeIcon icon={faCircleChevronLeft} size='2x'/>
        </i>
        <Card
          caption={card.caption}
          src={card.src}
          currNum={cardIdx + 1}
          totalNum={total}
        />
        <i onClick={goForward} style={{visibility: arrowRShow}} data-testid="right-arrow">
          <FontAwesomeIcon icon={faCircleChevronRight} size='2x'/>
        </i>
      </div>
    </div>
  );
}

Carousel.defaultProps = {
  cardData: [
    {
      src: image1,
      caption: "Photo by Richard Pasquarella on Unsplash"
    },
    {
      src: image2,
      caption: "Photo by Pratik Patel on Unsplash"
    },
    {
      src: image3,
      caption: "Photo by Josh Post on Unsplash"
    }
  ],
  title: "Shells from far away beaches."
};

export default Carousel;
