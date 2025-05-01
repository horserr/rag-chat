import HistoryEntry from "./HistoryEntry";
import styles from "@styles/components/HistoryPanel/HistoryList.module.scss";

interface HistoryEntryType {
  id: string;
  title: string;
}

const data: HistoryEntryType[] = [
  { id: "1", title: "Entry 1" },
  { id: "2", title: "Entry 2" },
  { id: "3", title: "Entry 3" },
  { id: "4", title: "Entry 4" },
  { id: "5", title: "Entry 5" },
];

const HistoryList = () => {
  const handleClick = (entry: HistoryEntryType) => {
    console.log("Clicked entry:", entry);
  };

  return (
    <div className={styles.historyList}>
      {data.map((entry) => (
        <HistoryEntry key={entry.id} entry={entry} onClick={handleClick} />
      ))}
    </div>
  );
};

export default HistoryList;
