import React from "react";
import Detector from "./detector.eball";

const Eball = (props) => {
  return (
    <React.Fragment>
      <div className="mt-2 text-center">
        <h1 className="font-medium text-sm md:text-xl underline underline-offset-8 text-dark">
          Wizard Tech - {props.title}
        </h1>
        <p className="text-xs md:text-base mt-3 text-dark">
          {props.description}
        </p>
      </div>
      <Detector />
    </React.Fragment>
  );
};

export default Eball;
