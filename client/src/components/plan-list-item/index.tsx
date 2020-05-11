import React from "react";
import { Task } from "../plan-list";

export const PlanListItem = ({
  task,
  setTask,
  updateTask,
  completeTask,
  archiveTask,
  deleteTask,
}: {
  task: Task;
  setTask: Function;
  updateTask: Function;
  completeTask: Function;
  archiveTask: Function;
  deleteTask: Function;
}) => (
  <li>
    <span>{task.id}</span>
    <input
      type="text"
      value={task.name}
      onChange={(e) => setTask(e.target.value)}
    />
    <button onClick={() => updateTask(task)}>Update</button>
    <button onClick={() => completeTask(task.id)}>Complete</button>
    <button onClick={() => archiveTask(task.id)}>Archive</button>
    <button onClick={() => deleteTask(task.id)}>Delete</button>
  </li>
);
