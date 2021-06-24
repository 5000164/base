import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Box, Button, Layer } from "grommet";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { sort } from "shared/src/utils/sort";
import { setEstimate, setName, setScheduledDate, Task } from "../../types/task";
import {
  addTaskWithScheduledDate,
  fetchScheduledTasks,
  updateTasksOrder,
} from "../../repositories/tasks";
import { importTemplateWithScheduledDate } from "../../repositories/templates";
import { reorder } from "../../utils/sort";
import { AppContext } from "../../App";
import { BacklogPageContext } from "../pages/BacklogPage";
import { TemplateListToImport } from "./TemplateListToImport";
import { TaskListItem } from "../molecules/TaskListItem";
import { CalculatedTimes } from "../atoms/CalculatedTimes";

export const ScheduledTaskList = () => {
  const { client, date } = React.useContext(AppContext);
  const { reloadCount, reload } = React.useContext(BacklogPageContext);

  const [tasks, setTasks] = useState([] as Task[]);
  useEffect(() => {
    fetchScheduledTasks(client, date).then((tasks) =>
      setTasks(sort<Task>(tasks))
    );
  }, [client, date, reloadCount]);

  const importFunction = (templateId: number) =>
    importTemplateWithScheduledDate(client, templateId, c(date)).then(() =>
      reload()
    );
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
          onClick={() =>
            addTaskWithScheduledDate(client, c(date)).then(() => reload())
          }
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

const c = (dateString: string) => {
  const date = new Date(new Date(Date.parse(dateString)).setHours(0, 0, 0, 0));
  return Math.floor(date.getTime() / 1000);
};

const StyledLayer = styled(Layer)`
  width: min(1024px, 100%);
`;
