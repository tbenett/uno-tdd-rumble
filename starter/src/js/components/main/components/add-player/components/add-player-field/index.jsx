import React, { Component } from "react";
import style from './style.css';

const AddPlayerField = () => {

  return (
    <div className={style.addPlayerField}>
        <label id="" for="addPlayerInput">Ajouter un joueur</label>
        <input id="addPlayerInput" type="text" />
    </div>
  );
}

export default AddPlayerField;