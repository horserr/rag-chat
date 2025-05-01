import HistoryPanel from "../components/HistoryPanel/HistoryPanel";
import ChatPanel from "../components/ChatPanel/ChatPanel";
import { Grid } from "@mui/material";
import { useState } from "react";

export function Chat(prop: { token: string }) {
  const [sessionId, setSessionId] = useState(0);

  return (
    <Grid
      container
      direction="row"
      spacing={0.5}
      sx={{
        justifyContent: "flex-start",
        alignItems: "stretch",
        height: "100%"
      }}
    >
      <Grid size={{ xs: 4, md: 2 }}>
        <HistoryPanel token={prop.token} setSessionId={setSessionId} sessionId={sessionId} />
      </Grid>
      <Grid size="grow">
        <ChatPanel sessionId={sessionId} token={prop.token} />
      </Grid>
    </Grid>
  );
}

export default Chat;
