import React from "react";
import { MemoryRouter, Route, Switch } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { createGlobalStyle } from "styled-components";
import { Box, Grid, Grommet } from "grommet";
import { theme } from "./theme";
import { PlanPage } from "./components/pages/PlanPage";
import { TemplatesPage } from "./components/pages/TemplatesPage";
import { TaskTracksPage } from "./components/pages/TaskTracksPage";
import { AnchorLink } from "./components/atoms/AnchorLink";

const client = new ApolloClient({
  uri: `http://localhost:${process.env.REACT_APP_BASE_PORT ?? "5164"}`,
});

export const AppContext = React.createContext({
  client,
});

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
            <Box gridArea="nav" overflow="scroll">
              <AnchorLink to="/" label="Plan" margin="small" />
              <AnchorLink to="/templates" label="Templates" margin="small" />
              <AnchorLink
                to="/task-tracks"
                label="Task Tracks"
                margin="small"
              />
            </Box>
            <Box gridArea="main" overflow="scroll" pad={{ bottom: "160px" }}>
              <Switch>
                <Route exact path="/">
                  <PlanPage />
                </Route>
                <Route path="/templates">
                  <TemplatesPage />
                </Route>
                <Route path="/task-tracks">
                  <TaskTracksPage />
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
  @font-face {
    font-family: "Hiragino Sans";
    src: local(HiraginoSans-W1);
    font-weight: 200;
  }

  html {
    width: 100%;
    height: 100%;
    margin: 0;
    font-family: "Hiragino Sans", sans-serif;
    font-weight: 200;
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
