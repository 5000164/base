import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "grommet";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { setEstimate, setName, TemplateTask } from "../../types/templateTask";
import {
  addTask,
  fetchTasks,
  updateTemplateTasksOrder,
} from "../../repositories/templates";
import { reorder, sort } from "../../utils/sort";
import { AppContext } from "../../App";
import { TemplatesPageContext } from "../pages/TemplatesPage";
import { TemplateTaskListItem } from "../molecules/TemplateTaskListItem";

export const TemplateTaskList = () => {
  const { client } = React.useContext(AppContext);
  const { reloadCount, reload, selectedTemplate } = React.useContext(
    TemplatesPageContext
  );

  const [tasks, setTasks] = useState([] as TemplateTask[]);
  useEffect(() => {
    fetchTasks(client, selectedTemplate.id!).then((tasks) =>
      setTasks(sort<TemplateTask>(tasks))
    );
  }, [client, reloadCount, selectedTemplate]);

  return (
    <>
      <TemplateName>{selectedTemplate.name}</TemplateName>
      <DragDropContext
        onDragEnd={(result) =>
          reorder<TemplateTask>(result, tasks, setTasks, (tasks) =>
            updateTemplateTasksOrder(client, tasks)
          )
        }
      >
        <Droppable droppableId="template-list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {tasks.map((task, index) => (
                <TemplateTaskListItem
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
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <AddButtonWrapper>
        <Button
          label="Add"
          onClick={() =>
            addTask(client, selectedTemplate.id!).then(() => reload())
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
