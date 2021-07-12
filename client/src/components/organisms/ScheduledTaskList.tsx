import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Box, Button, Layer } from "grommet";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { TasksUpdatedTask } from "schema/src/generated/client/graphql";
import { sort } from "shared/src/utils/sort";
import {
  setEstimate,
  setName,
  setScheduledDate,
  Task,
  toSortable,
  toTasksFromSortable,
  toTasksUpdatedTask,
} from "../../types/task";
import {
  addTaskWithScheduledDate,
  fetchScheduledTasks,
  importTemplateWithScheduledDate,
  updateTasksOrder,
} from "../../repositories/tasks";
import { toUTCUnixTime } from "../../utils/date";
import { reorder } from "../../utils/sort";
import { AppContext } from "../../App";
import { BacklogPageContext } from "../pages/BacklogPage";
import { TemplateListToImport } from "./TemplateListToImport";
import { ScheduledTaskListItem } from "../molecules/ScheduledTaskListItem";
import { CalculatedTimes } from "../atoms/CalculatedTimes";

export const ScheduledTaskList = () => {
  const { client, time } = React.useContext(AppContext);
  const { reloadCount, reload } = React.useContext(BacklogPageContext);

  const [tasks, setTasks] = useState([] as Task[]);
  useEffect(() => {
    fetchScheduledTasks(client, toUTCUnixTime(time)).then((tasks) =>
      setTasks(toTasksFromSortable(tasks, sort(tasks.map(toSortable))))
    );
  }, [client, time, reloadCount]);

  const importFunction = (templateId: number) =>
    importTemplateWithScheduledDate(
      client,
      templateId,
      toUTCUnixTime(time)
    ).then(() => reload());
  const [isImportDialogShown, setIsImportDialogShown] = useState(false);
  const showImportDialog = () => setIsImportDialogShown(true);
  const closeImportDialog = () => setIsImportDialogShown(false);

  return (
    <>
      <DragDropContext
        onDragEnd={(result) =>
          reorder<Task, TasksUpdatedTask>(
            result,
            tasks,
            toSortable,
            toTasksFromSortable,
            setTasks,
            toTasksUpdatedTask,
            (tasks) => updateTasksOrder(client, tasks)
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
                <ScheduledTaskListItem
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
            addTaskWithScheduledDate(client, toUTCUnixTime(time)).then(() =>
              reload()
            )
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

const StyledLayer = styled(Layer)`
  width: min(1024px, 100%);
`;
