import styles from "@styles/components/HistoryPanel/HistoryEntry.module.scss";

interface HistoryEntryType {
  id: string;
  title: string;
}

interface HistoryEntryProps {
  entry: HistoryEntryType;
  onClick: (entry: HistoryEntryType) => void;
}

const HistoryEntry = ({ entry, onClick }: HistoryEntryProps) => {
  return (
    <div className={styles.historyEntry} onClick={() => onClick(entry)}>
      <div>{entry.title}</div>
    </div>
  );
};

export default HistoryEntry;
