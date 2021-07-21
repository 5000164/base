import React, { useCallback, useState } from "react";
import { MemoryRouter, Route, Switch } from "react-router-dom";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { Helmet, HelmetProvider } from "react-helmet-async";
import styled, { createGlobalStyle } from "styled-components";
import { Box, Grid, Grommet } from "grommet";
import { theme } from "./theme";
import { BacklogPage } from "./components/pages/BacklogPage";
import { ReviewPage } from "./components/pages/ReviewPage";
import { TemplatesPage } from "./components/pages/TemplatesPage";
import { TaskTracksPage } from "./components/pages/TaskTracksPage";
import { TasksPage } from "./components/pages/TasksPage";
import { Navigation } from "./components/organisms/Navigation";

const client = new ApolloClient({
  uri: `http://localhost:${process.env.REACT_APP_BASE_PORT ?? "5164"}`,
  cache: new InMemoryCache(),
});

export const AppContext = React.createContext({
  client,
  time: 0,
  setTime: () => {},
} as {
  client: ApolloClient<any>;
  time: number;
  setTime: (time: number) => void;
});

const useAppContext = (client: ApolloClient<any>) => {
  const [time, setTime] = useState(new Date().setHours(0, 0, 0, 0));
  return {
    client,
    time,
    setTime: useCallback((time) => setTime(time), []),
  };
};

export const App = () => {
  return (
    <AppContext.Provider value={useAppContext(client)}>
      <MemoryRouter>
        <StyledGrommet full theme={theme} themeMode="dark">
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
              rows={["flex"]}
              columns={["280px", "flex"]}
              fill={true}
              gap="small"
              areas={[
                { name: "nav", start: [0, 0], end: [0, 0] },
                { name: "main", start: [1, 0], end: [1, 0] },
              ]}
            >
              <Box gridArea="nav" overflow="hidden">
                <Navigation />
              </Box>
              <Main
                gridArea="main"
                overflow="scroll"
                pad={{ top: "16px", bottom: "160px" }}
              >
                <Switch>
                  <Route exact path="/">
                    <BacklogPage />
                  </Route>
                  <Route path="/review">
                    <ReviewPage />
                  </Route>
                  <Route path="/templates">
                    <TemplatesPage />
                  </Route>
                  <Route path="/task-tracks">
                    <TaskTracksPage />
                  </Route>
                  <Route path="/tasks">
                    <TasksPage />
                  </Route>
                </Switch>
              </Main>
            </Grid>
          </HelmetProvider>
        </StyledGrommet>
      </MemoryRouter>
    </AppContext.Provider>
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
    font-size: 10px;
    font-kerning: normal; // フォントのカーニングを常に有効にする
    font-feature-settings: "palt"; // 自動カーニングさせる
    letter-spacing: 0.03rem; // 字間を調整
    -webkit-font-smoothing: antialiased; // フォントにアンチエイリアスをかける (少し細く見える)
    -moz-osx-font-smoothing: grayscale;
    color: ${theme.global.colors.text};
  }

  body {
    width: 100%;
    height: 100%;
    margin: 0;
    font-size: 1.8rem;
    line-height: 1.55;
  }

  a {
    color: ${theme.global.colors.text};
  }

  a:visited {
    color: ${theme.global.colors.text};
  }

  * {
    box-sizing: border-box;
  }
`;

const StyledGrommet = styled(Grommet)`
  background: hsla(0, 0%, 0%, 0);
`;

const Main = styled(Box)`
  background: ${theme.global.colors.background};
`;
