import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { PlanTask, setEstimate, setName } from "../../types/planTask";
import { fetchRecordedTasks } from "../../repositories/planTasks";
import { AppContext } from "../../App";
import { RecordedListItem } from "../molecules/RecordedListItem";
import { RecordedDate } from "../atoms/RecordedDate";
import { CalculatedRecordedTimes } from "../atoms/CalculatedRecordedTimes";
import { TaskTrack } from "../../types/taskTrack";
import { fetchTaskTracks } from "../../repositories/taskTracks";

export const RecordedList = () => {
  const { client } = React.useContext(AppContext);

  const [recordedTasks, setRecordedTasks] = useState([] as PlanTask[]);
  const [taskTracks, setTaskTracks] = useState([] as TaskTrack[]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  useEffect(() => {
    fetchRecordedTasks(client, date).then((recordedTasks) =>
      setRecordedTasks(recordedTasks)
    );
  }, [client, date]);
  useEffect(() => {
    fetchTaskTracks(client, date).then((taskTracks) =>
      setTaskTracks(taskTracks)
    );
  }, [client, date]);

  return (
    <>
      <RecordedDate date={date} setDate={setDate} />
      <StyledRecordedList>
        {tasksWithTracks(recordedTasks, taskTracks).map(
          ({ task, seconds }, index) => (
            <RecordedListItem
              key={index}
              task={task}
              seconds={seconds}
              setName={(v: string) =>
                setName(recordedTasks, setRecordedTasks, index, v)
              }
              setEstimate={(v: number) =>
                setEstimate(recordedTasks, setRecordedTasks, index, v)
              }
            />
          )
        )}
      </StyledRecordedList>
      <CalculatedRecordedTimes tasks={recordedTasks} />
    </>
  );
};

const StyledRecordedList = styled.ul`
  width: min(1024px, 100%);
  margin: 4px auto;
  padding: 0;
`;

const tasksWithTracks = (tasks: PlanTask[], taskTracks: TaskTrack[]) => {
  // tasks の要素ごとに taskTracks を全部ループして合計時間を計算していたらループ数が多くなるので、
  // まずは taskTracks だけで合計値を計算して task id で取り出せるようにする

  const totalTaskTracks = taskTracks.reduce(
    (totalTaskTracks: Map<number, number>, taskTrack: TaskTrack) => {
      const totalTime = totalTaskTracks.get(taskTrack.task.id);
      const taskTrackTime = taskTrack.stop_at
        ? taskTrack.stop_at - taskTrack.start_at
        : 0;
      totalTaskTracks.set(
        taskTrack.task.id,
        totalTime ? totalTime + taskTrackTime : taskTrackTime
      );
      return totalTaskTracks;
    },
    new Map()
  );
  return tasks.map((task) => ({
    task,
    seconds: totalTaskTracks.get(task.id) ?? 0,
  }));
};
