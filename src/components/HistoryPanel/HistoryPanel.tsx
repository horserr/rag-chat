import styles from "@styles/components/HistoryPanel/HistoryPanel.module.scss";
import HistoryList from "./HistoryList";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { SessionService } from "../../services/session_service";
import { SessionDto } from "../../models/session";

const HistoryPanel = (param: {token: string, setSessionId: any, sessionId : number}) => {
  const [sessions, setSessions] : [SessionDto[], any] = useState([]);
  const service = new SessionService(param.token);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() =>  {
    console.log("loading sessions");
    service.get_sessions(0, 10).then(x => setSessions(x.data.sort((a, b) =>  Date.parse(b.active_at) - Date.parse(a.active_at))))
  }, [refreshTrigger]);

  return (
    <Box className={styles.historyPanel} sx={{ height: "100%" }}>
      <HistoryList data={sessions} set_refresh={() => setRefreshTrigger(refreshTrigger + 1)} service={service} setSessionId={param.setSessionId} sessionId={param.sessionId}/>
    </Box>
  );
};

export default HistoryPanel;
