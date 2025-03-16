import React from "react";

const SaveReadingButton = ({ onSave }) => {
  return (
    <button className="save-reading-button" onClick={onSave}>
      Save This Reading
    </button>
  );
};

export default SaveReadingButton;
