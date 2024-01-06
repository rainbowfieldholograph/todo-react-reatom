import { useCallback, useMemo, useState } from 'react';
import { Button, Dialog } from '~/shared/ui';
import { TodoCreatorForm } from './creator-modal';
import { reatomTodoCreator } from './model';

export const TodoCreator = () => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const handleClose = useCallback(() => setDialogOpen(false), [setDialogOpen]);
	const formModel = useMemo(() => reatomTodoCreator(), []);

	return (
		<>
			<Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
				<Dialog.Trigger asChild>
					<Button>Create new Todo</Button>
				</Dialog.Trigger>
				<Dialog.Content>
					<TodoCreatorForm model={formModel} onClose={handleClose} />
				</Dialog.Content>
			</Dialog.Root>
		</>
	);
};
