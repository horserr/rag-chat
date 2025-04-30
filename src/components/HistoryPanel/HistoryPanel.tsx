import styles from "@styles/components/HistoryPanel/HistoryPanel.module.scss";
import HistoryList from "./HistoryList";

const HistoryPanel = () => {
  return (
    <div className={styles.historyPanel}>
      <HistoryList />
    </div>
  );
};

export default HistoryPanel;
