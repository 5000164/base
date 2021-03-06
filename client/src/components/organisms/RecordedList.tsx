import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { setEstimate, setName, Task } from "../../types/task";
import { fetchRecordedTasks } from "../../repositories/tasks";
import { AppContext } from "../../App";
import { RecordedListItem } from "../molecules/RecordedListItem";
import { CalculatedRecordedTimes } from "../atoms/CalculatedRecordedTimes";
import { TaskTrack } from "../../types/taskTrack";
import { fetchTaskTracks } from "../../repositories/taskTracks";
import { ReviewPageContext } from "../pages/ReviewPage";

export const RecordedList = () => {
  const { client, time } = React.useContext(AppContext);
  const { reloadCount } = React.useContext(ReviewPageContext);

  const [recordedTasks, setRecordedTasks] = useState([] as Task[]);
  const [taskTracks, setTaskTracks] = useState([] as TaskTrack[]);
  useEffect(() => {
    fetchRecordedTasks(client, time).then((recordedTasks) =>
      fetchTaskTracks(client, time).then((taskTracks) => {
        setRecordedTasks(recordedTasks);
        setTaskTracks(taskTracks);
      })
    );
  }, [client, time, reloadCount]);

  return (
    <>
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
  width: min(1024px, calc(100% - 16px));
  margin: 8px auto 0;
  padding: 0;
`;

const tasksWithTracks = (tasks: Task[], taskTracks: TaskTrack[]) => {
  // tasks の要素ごとに taskTracks を全部ループして合計時間を計算していたらループ数が多くなるので、
  // まずは taskTracks だけで合計値を計算して task id で取り出せるようにする

  const totalTaskTracks = taskTracks.reduce(
    (totalTaskTracks: Map<number, number>, taskTrack: TaskTrack) => {
      const totalTime = totalTaskTracks.get(taskTrack.task.taskId);
      const taskTrackTime = taskTrack.stopAt
        ? taskTrack.stopAt - taskTrack.startAt
        : 0;
      totalTaskTracks.set(
        taskTrack.task.taskId,
        totalTime ? totalTime + taskTrackTime : taskTrackTime
      );
      return totalTaskTracks;
    },
    new Map()
  );
  return tasks.map((task) => ({
    task,
    seconds: totalTaskTracks.get(task.taskId) ?? 0,
  }));
};
