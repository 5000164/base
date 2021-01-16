import React from "react";
import DefaultClient from "apollo-boost";
import styled from "styled-components";
import { PlanListItem } from "../PlanListItem";
import { Task } from "../../App";
import { CalculatedTimes } from "../CalculatedTimes";
import { TemplateListLayer } from "../TemplateListLayer";

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
}) => {
  return (
    <>
      {planError ? (
        <>
          <div>Error</div>
          <button onClick={() => fetchPlanTasks()}>Retry</button>
        </>
      ) : (
        <>
          <StyledPlanList>
            {planTasks.map((task, index) => (
              <PlanListItem
                key={index}
                task={task}
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
                completeTask={(id: number) => completeTask(id, setPlanError)}
                archiveTask={(id: number) => archiveTask(id, setPlanError)}
                deleteTask={(id: number) => deleteTask(id, setPlanError)}
              />
            ))}
          </StyledPlanList>
          <ButtonWrapper>
            <button onClick={() => addTask()}>Add</button>
            <button onClick={() => setShow(true)}>Import</button>
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
