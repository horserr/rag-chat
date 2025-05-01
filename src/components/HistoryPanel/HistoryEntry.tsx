import styles from "@styles/components/HistoryPanel/HistoryEntry.module.scss";
import ListItem from '@mui/material/ListItem';
import { ListItemButton } from "@mui/material";

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
    // <div className={styles.historyEntry} onClick={() => onClick(entry)}>
    //   <div>{entry.title}</div>
    // </div>

    <ListItem >
      <ListItemButton >
      {entry.title}
      </ListItemButton>
    </ListItem>
  );
};

export default HistoryEntry;
