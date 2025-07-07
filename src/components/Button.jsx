import React from "react";
import styles from "./Button.module.css";

const Button = React.memo(function Button({ label, onClick }) {
  return (
    <button
      className={styles.buttons}
      onClick={() => onClick(label)}
    >
      {label}
    </button>
  );
});

export default Button;
