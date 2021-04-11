import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "grommet";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { sort } from "shared/src/utils/sort";
import { PlanTask, setEstimate, setName } from "../../types/planTask";
import {
  addPlanTask,
  fetchPlanTasks,
  updatePlanTasksOrder,
} from "../../repositories/planTasks";
import { reorder } from "../../utils/sort";
import { AppContext } from "../../App";
import { PlanPageContext } from "../pages/PlanPage";
import { PlanListItem } from "../molecules/PlanListItem";
import { CalculatedTimes } from "../atoms/CalculatedTimes";

export const PlanList = () => {
  const { client } = React.useContext(AppContext);
  const { reloadCount, reload, showImportDialog } = React.useContext(
    PlanPageContext
  );

  const [planTasks, setPlanTasks] = useState([] as PlanTask[]);
  useEffect(() => {
    fetchPlanTasks(client).then((planTasks) =>
      setPlanTasks(sort<PlanTask>(planTasks))
    );
  }, [client, reloadCount]);

  return (
    <>
      <DragDropContext
        onDragEnd={(result) =>
          reorder<PlanTask>(result, planTasks, setPlanTasks, (planTasks) =>
            updatePlanTasksOrder(client, planTasks)
          )
        }
      >
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
                />
              ))}
              {provided.placeholder}
            </StyledPlanList>
          )}
        </Droppable>
      </DragDropContext>
      <ButtonWrapper>
        <Button
          label="Add"
          onClick={() => addPlanTask(client).then(() => reload())}
        />
        <Button label="Import" onClick={() => showImportDialog()} />
      </ButtonWrapper>
      <CalculatedTimes tasks={planTasks} />
    </>
  );
};

const StyledPlanList = styled.ul`
  width: min(1024px, calc(100% - 16px));
  margin: 8px auto 0;
  padding: 0;
`;

const ButtonWrapper = styled.div`
  width: min(1024px, 100%);
  margin: 8px auto 0;
  padding: 0;
`;
