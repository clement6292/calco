import styles from "./Button.module.css";

export default function Button({label, onClick}) {
  return (
    <button 
    className={styles.buttons}
    onClick={() => onClick(label)}
    >
    {label}
    </button>
  )
}
