import { TodoCreator, TodoSort, TodoList } from '~/features/todo/view/smart';
import styles from './todo-page.module.css';

export const TodoPage = () => {
	return (
		<>
			<h2 className={styles.title}>This is todo page</h2>
			<div className={styles.head}>
				<TodoSort />
				<TodoCreator />
			</div>
			<TodoList />
		</>
	);
};
