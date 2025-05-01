import HistoryPanel from "../components/HistoryPanel/HistoryPanel"; // 导入历史记录面板组件
import ChatPanel from "../components/ChatPanel/ChatPanel"; // 导入聊天面板组件
import { Grid } from "@mui/material";

import { HomeAppBar } from "../components/AppBar/HomeAppBar";

export function Home(prop: {setToken : Function}) {
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
          <HomeAppBar setToken={prop.setToken}/>
          </Grid>
          <Grid size="grow" container direction="row">
            <Grid size={{xs: 4, md: 2}}>
              <HistoryPanel />
            </Grid>
            <Grid size="grow">
              <ChatPanel />
            </Grid>
          </Grid>
      </Grid>
    );
}