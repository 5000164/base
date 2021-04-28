import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import FullCalendar from "@fullcalendar/react";
import { Task } from "../../types/task";
import { TaskTrack } from "../../types/taskTrack";
import { EventDetail } from "../../types/eventDetail";
import { fetchRecordedTasks, fetchTasks } from "../../repositories/tasks";
import { fetchTaskTracks } from "../../repositories/taskTracks";
import { AppContext } from "../../App";
import { ReviewPageContext } from "../pages/ReviewPage";
import { Am, Pm } from "../atoms/Calendar";
import { Tooltip } from "../atoms/Tooltip";

export const DayView = () => {
  const { client, date } = React.useContext(AppContext);
  const { reloadCount } = React.useContext(ReviewPageContext);

  const [tasks, setTasks] = useState([] as Task[]);
  const [recordedTasks, setRecordedTasks] = useState([] as Task[]);
  const [taskTracks, setTaskTracks] = useState([] as TaskTrack[]);
  useEffect(() => {
    fetchTasks(client).then((tasks) =>
      fetchRecordedTasks(client, date).then((recordedTasks) =>
        fetchTaskTracks(client, date).then((taskTracks) => {
          setTasks(tasks);
          setRecordedTasks(recordedTasks);
          setTaskTracks(taskTracks);
        })
      )
    );
  }, [client, date, reloadCount]);

  const events = useMemo(
    () => formatTaskTracksToEvents(taskTracks, tasks.concat(recordedTasks)),
    [tasks, recordedTasks, taskTracks]
  );

  const [eventDetail, setEventDetail] = useState({} as EventDetail);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [isHover, setIsHover] = useState(false);
  const mouseEnter = useCallback(({ title, start, end }, el) => {
    setEventDetail({
      title,
      start: formatToTime(start),
      end: formatToTime(end),
    });
    const { bottom, left } = el.getBoundingClientRect();
    setTop(bottom);
    setLeft(left);
    setIsHover(true);
  }, []);
  const mouseLeave = useCallback(() => {
    setIsHover(false);
  }, []);

  const amRef = useRef<FullCalendar>();
  const pmRef = useRef<FullCalendar>();
  useEffect(() => {
    amRef.current!.getApi().gotoDate(date);
    pmRef.current!.getApi().gotoDate(date);
  }, [date]);

  return (
    <CalendarWrapper>
      <Am
        ref={amRef}
        events={events}
        mouseEnter={mouseEnter}
        mouseLeave={mouseLeave}
      />
      <Pm
        ref={pmRef}
        events={events}
        mouseEnter={mouseEnter}
        mouseLeave={mouseLeave}
      />
      {isHover && <Tooltip top={top} left={left} eventDetail={eventDetail} />}
    </CalendarWrapper>
  );
};

const CalendarWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const formatTaskTracksToEvents = (taskTracks: TaskTrack[], tasks: Task[]) => {
  const taskNamesWithId = tasks.reduce(
    (taskNamesWithId: Map<number, string>, task: Task) => {
      taskNamesWithId.set(task.id, task.name);
      return taskNamesWithId;
    },
    new Map()
  );

  return taskTracks.map((taskTrack) => {
    const startAtDate = new Date(taskTrack.start_at * 1000);
    const stopAtDate = taskTrack.stop_at
      ? new Date(taskTrack.stop_at * 1000)
      : new Date();

    return {
      title: taskNamesWithId.get(taskTrack.task.id) ?? "Unknown",
      start: formatToDatetime(startAtDate),
      end: formatToDatetime(stopAtDate),
    };
  });
};

const formatToDatetime = (date: Date) =>
  [
    date.getFullYear().toString().padStart(4, "0"),
    "-",
    (date.getMonth() + 1).toString().padStart(2, "0"),
    "-",
    date.getDate().toString().padStart(2, "0"),
    "T",
    date.getHours().toString().padStart(2, "0"),
    ":",
    date.getMinutes().toString().padStart(2, "0"),
    ":",
    date.getSeconds().toString().padStart(2, "0"),
  ].join("");

const formatToTime = (date: Date) =>
  [
    date.getHours().toString().padStart(2, "0"),
    ":",
    date.getMinutes().toString().padStart(2, "0"),
  ].join("");
