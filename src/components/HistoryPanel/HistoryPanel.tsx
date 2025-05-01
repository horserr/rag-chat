import styles from "@styles/components/HistoryPanel/HistoryPanel.module.scss";
import HistoryList from "./HistoryList";
import { Box } from "@mui/material";

const HistoryPanel = () => {
  return (
    <Box className={styles.historyPanel} sx={{ height: "100%" }}>
      <HistoryList />
    </Box>
  );
};

export default HistoryPanel;
