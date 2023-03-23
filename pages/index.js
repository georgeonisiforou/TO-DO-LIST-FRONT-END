import styles from "../styles/Home.module.css";
import TodoList from "../components/TodoList";

export default function Home() {
  return (
    <div className={styles.container}>
      <TodoList />
    </div>
  );
}
