import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "grommet";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { TemplatesUpdatedTemplateTask } from "schema/src/generated/client/graphql";
import { sort } from "shared/src/utils/sort";
import {
  setEstimate,
  setName,
  TemplateTask,
  toSortable,
  toTemplatesUpdatedTemplateTask,
  toTemplateTasksFromSortable,
} from "../../types/templateTask";
import {
  addTask,
  fetchTasks,
  updateTemplateTasksOrder,
} from "../../repositories/templates";
import { reorder } from "../../utils/sort";
import { AppContext } from "../../App";
import { TemplatesPageContext } from "../pages/TemplatesPage";
import { TemplateTaskListItem } from "../molecules/TemplateTaskListItem";

export const TemplateTaskList = () => {
  const { client } = React.useContext(AppContext);
  const { reloadCount, reload, selectedTemplate } =
    React.useContext(TemplatesPageContext);

  const [tasks, setTasks] = useState([] as TemplateTask[]);
  useEffect(() => {
    fetchTasks(client, selectedTemplate.templateId).then((tasks) =>
      setTasks(toTemplateTasksFromSortable(tasks, sort(tasks.map(toSortable))))
    );
  }, [client, reloadCount, selectedTemplate]);

  return (
    <>
      <TemplateName>{selectedTemplate.name}</TemplateName>
      <DragDropContext
        onDragEnd={(result) =>
          reorder<TemplateTask, TemplatesUpdatedTemplateTask>(
            result,
            tasks,
            toSortable,
            toTemplateTasksFromSortable,
            setTasks,
            toTemplatesUpdatedTemplateTask,
            (tasks) => updateTemplateTasksOrder(client, tasks)
          )
        }
      >
        <Droppable droppableId="template-list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {tasks.map((task, index) => (
                <TemplateTaskListItem
                  key={index}
                  templateTask={task}
                  index={index}
                  setName={(v: string) => setName(tasks, setTasks, index, v)}
                  setEstimate={(v: number) =>
                    setEstimate(tasks, setTasks, index, v)
                  }
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <AddButtonWrapper>
        <Button
          label="Add"
          onClick={() =>
            addTask(client, selectedTemplate.templateId!).then(() => reload())
          }
        />
      </AddButtonWrapper>
    </>
  );
};

const TemplateName = styled.div`
  margin: 20px auto;
`;

const AddButtonWrapper = styled.div`
  width: min(1024px, 100%);
  margin: 4px auto;
`;
