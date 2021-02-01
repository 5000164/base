import { Sortable } from "../types/sortable";

export const sort = <T extends Sortable>(tasks: T[]): T[] => {
  const [firstTask] = tasks.splice(
    tasks.findIndex((t) => !t.previous_id),
    1
  );

  if (firstTask) {
    const sortedTasks = [];
    sortedTasks.push(firstTask);

    const sort = (nextId: number, remainTasks: T[], sortedTasks: T[]): T[] => {
      if (remainTasks.length === 0) {
        return sortedTasks;
      }

      const [nextTask] = remainTasks.splice(
        remainTasks.findIndex((t) => t.id === nextId),
        1
      );
      sortedTasks.push(nextTask);

      if (nextTask.next_id) {
        return sort(nextTask.next_id, remainTasks, sortedTasks);
      } else {
        return [...sortedTasks, ...remainTasks];
      }
    };

    if (firstTask.next_id) {
      return sort(firstTask.next_id, tasks, sortedTasks);
    } else {
      return [...sortedTasks, ...tasks];
    }
  } else {
    return tasks;
  }
};
