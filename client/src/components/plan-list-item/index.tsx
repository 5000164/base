import React from "react";
import { Task } from "../plan-list";

export const PlanListItem = ({
  task,
  setTask,
  updateTask,
  deleteTask,
}: {
  task: Task;
  setTask: Function;
  updateTask: Function;
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
    <button onClick={() => deleteTask(task.id)}>Remove</button>
  </li>
);
