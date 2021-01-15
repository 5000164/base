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
  setRecordedTasks,
  recordedError,
  setRecordedError,
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
  updatePlanTasksOrder,
  startTaskTrack,
}: {
  client: DefaultClient<any>;
  planTasks: Task[];
  setPlanTasks: Function;
  planError: boolean;
  setPlanError: Function;
  recordedTasks: Task[];
  setRecordedTasks: Function;
  recordedError: boolean;
  setRecordedError: Function;
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
  updatePlanTasksOrder: Function;
  startTaskTrack: Function;
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
        updatePlanTasksOrder={updatePlanTasksOrder}
        startTaskTrack={startTaskTrack}
      />
      <RecordedList
        recordedTasks={recordedTasks}
        setRecordedTasks={setRecordedTasks}
        recordedError={recordedError}
        setRecordedError={setRecordedError}
        date={date}
        setDate={setDate}
        fetchRecordedTasks={fetchRecordedTasks}
        setName={setName}
        setEstimate={setEstimate}
        setActual={setActual}
        updateTask={updateTask}
        completeTask={completeTask}
        archiveTask={archiveTask}
        deleteTask={deleteTask}
      />
    </>
  );
};
