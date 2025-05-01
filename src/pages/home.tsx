import { Grid } from "@mui/material";
import { HomeAppBar } from "../components/AppBar/HomeAppBar";
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Chat from "./chat";
import Evaluation from "./evaluation";

export function Home(prop: {setToken : Function, token: string}) {
  const [currentView, setCurrentView] = useState<string>('chat');

  return (
    <Grid
      container
      direction="column"
      spacing={0.5}
      sx={{
        justifyContent: "flex-start",
        alignItems: "stretch",
        height: "100vh"
      }}
    >
      <Grid size="auto">
        <HomeAppBar
          setToken={prop.setToken}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      </Grid>
      <Grid size="grow">
        <Routes>
          <Route path="/" element={<Chat token={prop.token} />} />
          <Route path="/eval/*" element={<Evaluation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Grid>
    </Grid>
  );
}
