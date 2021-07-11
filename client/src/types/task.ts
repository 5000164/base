import assert from "assert";
import { TasksUpdatedTask } from "schema/src/generated/client/graphql";
import { Status } from "shared/src/types/status";
import { Sortable } from "shared/src/types/sortable";

export type Task = {
  taskId: number;
  name: string;
  status: Status;
  estimate?: number;
  scheduledDate?: number;
  statusChangedAt?: number;
  previousId?: number;
  nextId?: number;
};

export const isTask = (arg: any): arg is Task =>
  typeof arg === "object" &&
  Object.keys(arg).every((k) =>
    [
      "__typename",
      "taskId",
      "name",
      "status",
      "estimate",
      "scheduledDate",
      "statusChangedAt",
      "previousId",
      "nextId",
    ].includes(k)
  );

export const setName = (
  tasks: Task[],
  setTasks: Function,
  index: number,
  name: string
) => {
  const newTasks = [...tasks];
  newTasks[index].name = name;
  setTasks(newTasks);
};

export const setEstimate = (
  tasks: Task[],
  setTasks: Function,
  index: number,
  estimate: number
) => {
  const newTasks = [...tasks];
  newTasks[index].estimate = estimate;
  setTasks(newTasks);
};

export const setScheduledDate = (
  tasks: Task[],
  setTasks: Function,
  index: number,
  scheduledDate: number
) => {
  const newTasks = [...tasks];
  newTasks[index].scheduledDate = scheduledDate;
  setTasks(newTasks);
};

export const toSortable = (task: Task) =>
  ({
    id: task.taskId,
    previousId: task.previousId,
    nextId: task.nextId,
  } as Sortable);

export const toTasksFromSortable = (tasks: Task[], sortables: Sortable[]) =>
  sortables.map((s) => {
    const t = tasks.find((t) => t.taskId === s.id);
    const taskFromSortable = {
      ...t,
      ...{
        previousId: s.previousId,
        nextId: s.nextId,
      },
    };
    assert(isTask(taskFromSortable));
    return taskFromSortable;
  });

export const toTasksUpdatedTask = (item: Sortable) =>
  // null の場合は null との接続、つまり先頭か末尾を表すので除外するのは undefined の時のみ
  ({
    taskId: item.id,
    ...(typeof item.previousId !== "undefined"
      ? { previousId: item.previousId }
      : {}),
    ...(typeof item.nextId !== "undefined" ? { nextId: item.nextId } : {}),
  } as TasksUpdatedTask);
