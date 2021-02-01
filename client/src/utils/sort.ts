import { DropResult } from "react-beautiful-dnd";
import { Sortable } from "shared/src/types/sortable";

export const reorder = <T extends Sortable>(
  result: DropResult,
  items: T[],
  setItems: (items: T[]) => void,
  updateOrder: (items: Sortable[]) => Promise<boolean>
) => {
  if (!result.destination) {
    return;
  }

  const {
    destination: { index: di },
    source: { index: si },
  } = result;

  if (di === si) {
    return;
  }

  const newItems = [...items];
  const updatedItems = [] as Sortable[];
  const [reorderedItems] = newItems.splice(si, 1);

  if (reorderedItems.previous_id && reorderedItems.next_id) {
    newItems[si - 1].next_id = reorderedItems.next_id;
    updatedItems.push({
      id: newItems[si - 1].id,
      next_id: newItems[si - 1].next_id,
    });

    newItems[si].previous_id = reorderedItems.previous_id;
    updatedItems.push({
      id: newItems[si].id,
      previous_id: newItems[si].previous_id,
    });
  } else if (!reorderedItems.previous_id && reorderedItems.next_id) {
    newItems[si].previous_id = undefined;
    updatedItems.push({
      id: newItems[si].id,
      previous_id: null,
    });
  } else if (reorderedItems.previous_id && !reorderedItems.next_id) {
    newItems[si - 1].next_id = undefined;
    updatedItems.push({
      id: newItems[si - 1].id,
      next_id: null,
    });
  }

  newItems.splice(di, 0, reorderedItems);
  setItems(newItems);

  if (di === 0) {
    reorderedItems.previous_id = undefined;
  } else {
    reorderedItems.previous_id = newItems[di - 1].id;
    newItems[di - 1].next_id = reorderedItems.id;
    updatedItems.push({
      id: newItems[di - 1].id,
      next_id: newItems[di - 1].next_id,
    });
  }

  if (di === newItems.length - 1) {
    reorderedItems.next_id = undefined;
  } else {
    reorderedItems.next_id = newItems[di + 1].id;
    newItems[di + 1].previous_id = reorderedItems.id;
    updatedItems.push({
      id: newItems[di + 1].id,
      previous_id: newItems[di + 1].previous_id,
    });
  }

  updatedItems.push({
    id: reorderedItems.id,
    next_id: reorderedItems.next_id ?? null,
    previous_id: reorderedItems.previous_id ?? null,
  });

  updateOrder(
    updatedItems.reduce((tasks, task) => {
      const index = tasks.findIndex((t) => t.id === task.id);
      if (index === -1) {
        tasks.push(task);
      } else {
        tasks[index] = { ...tasks[index], ...task };
      }
      return tasks;
    }, [] as { id: number; previous_id?: number | null; next_id?: number | null }[])
  ).then();
};
