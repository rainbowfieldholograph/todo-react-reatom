import {
	action,
	reatomAsync,
	withErrorAtom,
	onConnect,
	withDataAtom,
	AsyncAction,
	onDisconnect,
} from '@reatom/framework';
import { TodoDto } from '../types';
import { deleteTodo, getTodos, postTodo, toggleCompletedTodo } from '../api';

export type Todo = TodoDto & {
	remove: AsyncAction;
};

const initialTodos: Todo[] = [];

const createTodoReatom = (todoToCreate: TodoDto): Todo => {
	const todo = {
		...todoToCreate,
		remove: reatomAsync(async (ctx, todoId: TodoDto['_id']) => {
			await deleteTodo(todoId);

			const filtered = ctx
				.get(onFetchTodos.dataAtom)
				.filter((todo) => todo._id !== todoId);

			onFetchTodos.dataAtom(ctx, filtered);
		}),
	};

	return todo;
};

export const onFetchTodos = reatomAsync(async () => {
	const { data: todos } = await getTodos();

	return todos.map(createTodoReatom);
}).pipe(withDataAtom(initialTodos));

export const onResetTodos = action((ctx) => {
	onFetchTodos.dataAtom(ctx, initialTodos);
}, 'onResetTodos');

type CreateTodoArgs = Pick<TodoDto, 'title' | 'description'>;

export const onCreateTodo = reatomAsync(
	async (ctx, todoToCreate: CreateTodoArgs) => {
		const createTodoResponse = await postTodo(todoToCreate);

		const { data: createdTodo } = createTodoResponse;
		const todoToPush = createTodoReatom(createdTodo);

		onFetchTodos.dataAtom(ctx, (prevTodos) => [...prevTodos, todoToPush]);
	},
).pipe(
	withErrorAtom((ctx, error) => {
		if (error instanceof Response) {
			return error.status;
		}

		if (error instanceof Error) {
			return error?.message ?? 'unknown error';
		}
	}),
);

export const onToggleTodo = reatomAsync(async (ctx, todoId: TodoDto['_id']) => {
	const todoToToggle = ctx
		.get(onFetchTodos.dataAtom)
		.find(({ _id }) => _id === todoId);

	if (!todoToToggle) return;

	try {
		await toggleCompletedTodo(todoId, !todoToToggle.completed);

		onFetchTodos.dataAtom(ctx, (prevTodos) => {
			return prevTodos.map((todo) => {
				return todo._id === todoId
					? { ...todo, completed: !todo.completed }
					: todo;
			});
		});
	} catch (error) {
		console.error(error);
	}
});

onConnect(onFetchTodos.dataAtom, (ctx) => {
	ctx.schedule(async () => {
		const { data: todos } = await getTodos();
		const todosToApply = todos.map(createTodoReatom);

		onFetchTodos.dataAtom(ctx, todosToApply);
	});
});

onDisconnect(onFetchTodos.dataAtom, onFetchTodos.dataAtom.reset);