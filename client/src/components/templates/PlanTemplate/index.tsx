import React from "react";
import DefaultClient from "apollo-boost";
import { Task } from "../../../App";
import { PlanList } from "../../PlanList";
import { RecordedList } from "../../RecordedList";

export const PlanTemplate = ({
  client,
  planTasks,
  setPlanTasks,
  planError,
  setPlanError,
  recordedTasks,
  recordedError,
  date,
  setDate,
  reload,
  show,
  setShow,
  fetchPlanTasks,
  fetchRecordedTasks,
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
  recordedTasks: Task[];
  recordedError: boolean;
  date: string;
  setDate: Function;
  reload: Function;
  show: boolean;
  setShow: Function;
  fetchPlanTasks: Function;
  fetchRecordedTasks: Function;
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
      <PlanList
        client={client}
        planTasks={planTasks}
        setPlanTasks={setPlanTasks}
        planError={planError}
        setPlanError={setPlanError}
        reload={reload}
        show={show}
        setShow={setShow}
        fetchPlanTasks={fetchPlanTasks}
        setName={setName}
        setEstimate={setEstimate}
        setActual={setActual}
        addTask={addTask}
        updateTask={updateTask}
        completeTask={completeTask}
        archiveTask={archiveTask}
        deleteTask={deleteTask}
      />
      <RecordedList
        recordedTasks={recordedTasks}
        recordedError={recordedError}
        date={date}
        setDate={setDate}
        fetchRecordedTasks={fetchRecordedTasks}
      />
    </>
  );
};
