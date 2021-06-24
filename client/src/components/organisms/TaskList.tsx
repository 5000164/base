import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Box, Button, Layer } from "grommet";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { setEstimate, setName, setScheduledDate, Task } from "../../types/task";
import {
  addTask,
  fetchTasks,
  updateTasksOrder,
} from "../../repositories/tasks";
import { importTemplate } from "../../repositories/templates";
import { reorder } from "../../utils/sort";
import { AppContext } from "../../App";
import { TasksPageContext } from "../pages/TasksPage";
import { TemplateListToImport } from "./TemplateListToImport";
import { TaskListItem } from "../molecules/TaskListItem";
import { CalculatedTimes } from "../atoms/CalculatedTimes";

export const TaskList = () => {
  const { client } = React.useContext(AppContext);
  const { reloadCount, reload } = React.useContext(TasksPageContext);

  const [tasks, setTasks] = useState([] as Task[]);
  useEffect(() => {
    fetchTasks(client).then((tasks) => setTasks(tasks));
  }, [client, reloadCount]);

  const importFunction = (templateId: number) =>
    importTemplate(client, templateId).then(() => reload());
  const [isImportDialogShown, setIsImportDialogShown] = useState(false);
  const showImportDialog = () => setIsImportDialogShown(true);
  const closeImportDialog = () => setIsImportDialogShown(false);

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
                  setScheduledDate={(v: number) =>
                    setScheduledDate(tasks, setTasks, index, v)
                  }
                  reload={reload}
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
      {isImportDialogShown && (
        <StyledLayer
          full={"vertical"}
          margin={"large"}
          onEsc={() => closeImportDialog()}
          onClickOutside={() => closeImportDialog()}
        >
          <Box fill="vertical" overflow="scroll">
            <TemplateListToImport importFunction={importFunction} />
            <Button label="close" onClick={() => closeImportDialog()} />
          </Box>
        </StyledLayer>
      )}
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

const StyledLayer = styled(Layer)`
  width: min(1024px, 100%);
`;
