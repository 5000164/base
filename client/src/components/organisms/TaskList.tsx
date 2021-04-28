import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "grommet";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { sort } from "shared/src/utils/sort";
import { setEstimate, setName, Task } from "../../types/task";
import {
  addTask,
  fetchTasks,
  updateTasksOrder,
} from "../../repositories/tasks";
import { reorder } from "../../utils/sort";
import { AppContext } from "../../App";
import { TasksPageContext } from "../pages/TasksPage";
import { TaskListItem } from "../molecules/TaskListItem";
import { CalculatedTimes } from "../atoms/CalculatedTimes";

export const TaskList = () => {
  const { client } = React.useContext(AppContext);
  const { reloadCount, reload, showImportDialog } = React.useContext(
    TasksPageContext
  );

  const [tasks, setTasks] = useState([] as Task[]);
  useEffect(() => {
    fetchTasks(client).then((tasks) => setTasks(sort<Task>(tasks)));
  }, [client, reloadCount]);

  return (
    <>
      <DragDropContext
        onDragEnd={(result) =>
          reorder<Task>(result, tasks, setTasks, (tasks) =>
            updateTasksOrder(client, tasks)
          )
        }
      >
        <Droppable droppableId="task-list">
          {(provided) => (
            <StyledTaskList
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {tasks.map((task, index) => (
                <TaskListItem
                  key={index}
                  task={task}
                  index={index}
                  setName={(v: string) => setName(tasks, setTasks, index, v)}
                  setEstimate={(v: number) =>
                    setEstimate(tasks, setTasks, index, v)
                  }
                />
              ))}
              {provided.placeholder}
            </StyledTaskList>
          )}
        </Droppable>
      </DragDropContext>
      <ButtonWrapper>
        <Button
          label="Add"
          onClick={() => addTask(client).then(() => reload())}
        />
        <Button label="Import" onClick={() => showImportDialog()} />
      </ButtonWrapper>
      <CalculatedTimes tasks={tasks} />
    </>
  );
};

const StyledTaskList = styled.ul`
  width: min(1024px, calc(100% - 16px));
  margin: 8px auto 0;
  padding: 0;
`;

const ButtonWrapper = styled.div`
  width: min(1024px, 100%);
  margin: 8px auto 0;
  padding: 0;
`;
