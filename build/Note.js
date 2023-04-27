import React from "react";

const Note = ({ note }) => {
  return (
    <li>
      {note.content}
      {note.important}
    </li>
  );
};

export default Note;
