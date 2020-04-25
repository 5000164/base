import React from "react";
import { Task } from "../plan-list";

export const PlanListItem = ({
  task,
  setTask,
  updateTask,
}: {
  task: Task;
  setTask: Function;
  updateTask: Function;
}) => (
  <li>
    <span>{task.id}</span>
    <input
      type="text"
      value={task.name}
      onChange={(e) => setTask(e.target.value)}
    />
    <button onClick={() => updateTask(task)}>Update</button>
  </li>
);
