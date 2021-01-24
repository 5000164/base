import React from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import DefaultClient from "apollo-boost";
import styled from "styled-components";
import { Button } from "grommet";
import { PlanListItem } from "./PlanListItem";
import { Task } from "../App";
import { CalculatedTimes } from "./atoms/CalculatedTimes";
import { TemplateListLayer } from "./TemplateListLayer";

export const PlanList = ({
  client,
  planTasks,
  setPlanTasks,
  planError,
  setPlanError,
  reload,
  show,
  setShow,
  fetchPlanTasks,
  setName,
  setEstimate,
  setActual,
  addTask,
  updateTask,
  completeTask,
  archiveTask,
  deleteTask,
  updatePlanTasksOrder,
  startTaskTrack,
}: {
  client: DefaultClient<any>;
  planTasks: Task[];
  setPlanTasks: Function;
  planError: boolean;
  setPlanError: Function;
  reload: Function;
  show: boolean;
  setShow: Function;
  fetchPlanTasks: Function;
  setName: Function;
  setEstimate: Function;
  setActual: Function;
  addTask: Function;
  updateTask: Function;
  completeTask: Function;
  archiveTask: Function;
  deleteTask: Function;
  updatePlanTasksOrder: Function;
  startTaskTrack: Function;
}) => {
  const reorderPlanTasks = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const {
      destination: { index: di },
      source: { index: si },
    } = result;

    if (di === si) {
      return;
    }

    const newPlanTasks = [...planTasks];
    const updatedPlanTasks = [] as {
      id: number;
      previous_id?: number | null;
      next_id?: number | null;
    }[];
    const [reorderedPlanTask] = newPlanTasks.splice(si, 1);

    if (reorderedPlanTask.previous_id && reorderedPlanTask.next_id) {
      newPlanTasks[si - 1].next_id = reorderedPlanTask.next_id;
      updatedPlanTasks.push({
        id: newPlanTasks[si - 1].id,
        next_id: newPlanTasks[si - 1].next_id,
      });

      newPlanTasks[si].previous_id = reorderedPlanTask.previous_id;
      updatedPlanTasks.push({
        id: newPlanTasks[si].id,
        previous_id: newPlanTasks[si].previous_id,
      });
    } else if (!reorderedPlanTask.previous_id && reorderedPlanTask.next_id) {
      newPlanTasks[si].previous_id = undefined;
      updatedPlanTasks.push({
        id: newPlanTasks[si].id,
        previous_id: null,
      });
    } else if (reorderedPlanTask.previous_id && !reorderedPlanTask.next_id) {
      newPlanTasks[si - 1].next_id = undefined;
      updatedPlanTasks.push({
        id: newPlanTasks[si - 1].id,
        next_id: null,
      });
    }

    newPlanTasks.splice(di, 0, reorderedPlanTask);
    setPlanTasks(newPlanTasks);

    if (di === 0) {
      reorderedPlanTask.previous_id = undefined;
    } else {
      reorderedPlanTask.previous_id = newPlanTasks[di - 1].id;
      newPlanTasks[di - 1].next_id = reorderedPlanTask.id;
      updatedPlanTasks.push({
        id: newPlanTasks[di - 1].id,
        next_id: newPlanTasks[di - 1].next_id,
      });
    }

    if (di === newPlanTasks.length - 1) {
      reorderedPlanTask.next_id = undefined;
    } else {
      reorderedPlanTask.next_id = newPlanTasks[di + 1].id;
      newPlanTasks[di + 1].previous_id = reorderedPlanTask.id;
      updatedPlanTasks.push({
        id: newPlanTasks[di + 1].id,
        previous_id: newPlanTasks[di + 1].previous_id,
      });
    }

    updatedPlanTasks.push({
      id: reorderedPlanTask.id,
      next_id: reorderedPlanTask.next_id ?? null,
      previous_id: reorderedPlanTask.previous_id ?? null,
    });

    updatePlanTasksOrder(
      updatedPlanTasks.reduce((tasks, task) => {
        const index = tasks.findIndex((t) => t.id === task.id);
        if (index === -1) {
          tasks.push(task);
        } else {
          tasks[index] = { ...tasks[index], ...task };
        }
        return tasks;
      }, [] as { id: number; previous_id?: number | null; next_id?: number | null }[])
    );
  };

  return (
    <>
      {planError ? (
        <>
          <div>Error</div>
          <Button label="Retry" onClick={() => fetchPlanTasks()} />
        </>
      ) : (
        <>
          <DragDropContext onDragEnd={reorderPlanTasks}>
            <Droppable droppableId="plan-list">
              {(provided) => (
                <StyledPlanList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {planTasks.map((task, index) => (
                    <PlanListItem
                      key={index}
                      task={task}
                      index={index}
                      setName={(v: string) =>
                        setName(planTasks, setPlanTasks, index, v)
                      }
                      setEstimate={(v: number) =>
                        setEstimate(planTasks, setPlanTasks, index, v)
                      }
                      setActual={(v: number) =>
                        setActual(planTasks, setPlanTasks, index, v)
                      }
                      updateTask={(t: Task) => updateTask(t, setPlanError)}
                      completeTask={(id: number) =>
                        completeTask(id, setPlanError)
                      }
                      archiveTask={(id: number) =>
                        archiveTask(id, setPlanError)
                      }
                      deleteTask={(id: number) => deleteTask(id, setPlanError)}
                      startTaskTrack={startTaskTrack}
                    />
                  ))}
                  {provided.placeholder}
                </StyledPlanList>
              )}
            </Droppable>
          </DragDropContext>
          <ButtonWrapper>
            <Button label="Add" onClick={() => addTask()} />
            <Button label="Import" onClick={() => setShow(true)} />
          </ButtonWrapper>
          <CalculatedTimes tasks={planTasks} />
          {show && (
            <TemplateListLayer
              client={client}
              reloadTasks={reload}
              setShow={setShow}
            />
          )}
        </>
      )}
    </>
  );
};

const StyledPlanList = styled.ul`
  width: min(1024px, 100%);
  margin: 80px auto 4px;
  padding: 0;
`;

const ButtonWrapper = styled.div`
  width: min(1024px, 100%);
  margin: 4px auto;
`;
