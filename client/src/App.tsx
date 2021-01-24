import React from "react";
import { MemoryRouter, Route, Switch } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { createGlobalStyle } from "styled-components";
import { Box, Grid, Grommet } from "grommet";
import { theme } from "./theme";
import { TemplateList } from "./components/organisms/TemplateList";
import { PlanPage } from "./components/pages/PlanPage";
import { TaskTrackList } from "./components/organisms/TaskTrackList";
import { AnchorLink } from "./components/atoms/AnchorLink";

const client = new ApolloClient({
  uri: `http://localhost:${process.env.REACT_APP_BASE_PORT ?? "5164"}`,
});

export interface Task {
  id: number;
  name: string;
  status?: Status;
  estimate?: number;
  actual?: number;
  previous_id?: number;
  next_id?: number;
}

export interface Template {
  id: number;
  name: string;
}

export interface TemplateTask {
  id: number;
  name: string;
  estimate?: number;
  previous_id?: number;
  next_id?: number;
}

export interface TaskTrack {
  task_track_id: number;
  task: TaskTrackTask;
  start_at?: number;
  stop_at?: number;
}

export interface TaskTrackTask {
  id: number;
  name: string;
}

export enum Status {
  Normal = 0,
  Completed = 1,
  Archived = 2,
}

export const App = () => {
  return (
    <MemoryRouter>
      <Grommet full theme={theme} themeMode="dark">
        <HelmetProvider>
          <GlobalStyle />
          <Helmet>
            <meta charSet="utf-8" />
            <title>Base</title>
            <meta
              httpEquiv="Content-Security-Policy"
              content="script-src 'self' 'unsafe-inline';"
            />
          </Helmet>
          <Grid
            fill={true}
            rows={["flex"]}
            columns={["small", "flex"]}
            gap="small"
            areas={[
              { name: "nav", start: [0, 0], end: [0, 0] },
              { name: "main", start: [1, 0], end: [1, 0] },
            ]}
          >
            <Box gridArea="nav">
              <AnchorLink to="/" label="Plan" margin="small" />
              <AnchorLink to="/templates" label="Templates" margin="small" />
              <AnchorLink
                to="/task-tracks"
                label="Task Tracks"
                margin="small"
              />
            </Box>
            <Box gridArea="main">
              <Switch>
                <Route exact path="/">
                  <PlanPage client={client} />
                </Route>
                <Route path="/templates">
                  <>
                    <TemplateList client={client} />
                  </>
                </Route>
                <Route path="/task-tracks">
                  <>
                    <TaskTrackList client={client} />
                  </>
                </Route>
              </Switch>
            </Box>
          </Grid>
        </HelmetProvider>
      </Grommet>
    </MemoryRouter>
  );
};

const GlobalStyle = createGlobalStyle`
  html {
    width: 100%;
    height: 100%;
    margin: 0;
    font-family: sans-serif;
    font-weight: lighter;
    font-size: 10px;
    font-kerning: normal; // フォントのカーニングを常に有効にする
    font-feature-settings: "palt"; // 自動カーニングさせる
    letter-spacing: 0.03rem; // 字間を調整
    -webkit-font-smoothing: antialiased; // フォントにアンチエイリアスをかける (少し細く見える)
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    width: 100%;
    height: 100%;
    margin: 0;
    font-size: 1.8rem;
    line-height: 1.55;
    color: hsl(235, 10%, 28%);
    background-color: hsl(0, 100%, 100%);
  }

  a {
    color: hsl(235, 10%, 50%);
  }

  a:visited {
    color: hsl(235, 10%, 50%);
  }

  * {
    box-sizing: border-box;
  }
`;
