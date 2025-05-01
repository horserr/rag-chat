import HistoryEntry from "./HistoryEntry";
import styles from "@styles/components/HistoryPanel/HistoryList.module.scss";
import List from '@mui/material/List';
import { IconButton, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { SessionDto } from "../../models/session";
import { Delete, Add } from "@mui/icons-material";
import { SessionService } from "../../services/session_service";


const HistoryList = (param: { data: SessionDto[], set_refresh: any, service: SessionService, setSessionId: any, sessionId : number }) => {

  const handleDelete = (id: number) => {
    param.service.delete_session(id)
    param.set_refresh()
  }

  const handleNew = () => {
    param.service.new_session()
    param.set_refresh()
  }

  const handleEdit = (id: number, content: string) => {
    param.service.put_session(id, content)
    param.set_refresh()
  }


  return (
    <List>
      <ListItemButton onClick={handleNew}>
        <Add />

        <Typography>
          New Session
        </Typography>
      </ListItemButton>

      {param.data.map((entry) => (
        <HistoryEntry 
          title={entry.title + (((entry.title) === "New Session") ? " (" + entry.id + ")" : "")} 
          handleDelete={() => handleDelete(entry.id)} key={entry.id} 
          handleEdit={(content: string) => handleEdit(entry.id, content)}
          onClick={() => {
            console.log(entry.id);
            param.setSessionId(entry.id)}}
          selected={entry.id === param.sessionId}
           />
      ))}
    </List>
  );
};

export default HistoryList;
