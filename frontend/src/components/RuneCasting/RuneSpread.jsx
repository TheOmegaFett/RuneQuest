import React from "react";
import RuneCard from "./RuneCard";

const RuneSpread = ({ spread, runes }) => {
  // Different layout based on spread type
  const getSpreadLayout = () => {
    switch (spread.id) {
      case "three-rune":
        return "three-rune-layout";
      case "five-rune":
        return "five-rune-cross";
      case "single-rune":
        return "single-rune-layout";
      default:
        return "";
    }
  };

  return (
    <div className={`rune-spread ${getSpreadLayout()}`}>
      {runes.map((rune, index) => (
        <RuneCard
          key={index}
          rune={rune}
          position={index}
          spreadType={spread.id}
        />
      ))}
    </div>
  );
};

export default RuneSpread;
