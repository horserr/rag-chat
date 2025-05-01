import ListItem from '@mui/material/ListItem';
import { IconButton, ListItemButton, ListItemText, TextField } from "@mui/material";
import { Delete, Edit, Check } from '@mui/icons-material';
import { SessionDto } from '../../models/session';
import react from '@vitejs/plugin-react-swc';
import { useState } from 'react';


interface HistoryEntryType {
  id: string;
  title: string;
}


const HistoryEntry = (param: { title: string, handleDelete : any, handleEdit : any , onClick: any, selected: boolean}) => {
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(param.title);

  return (
    <ListItemButton sx={{ flexGrow: 1 }} onClick={param.onClick}>
      {!editing ? 
        <>
        <ListItemText primary={param.title} sx={{color: param.selected ? "royalblue" : "inherit"}} /> 
        <IconButton onClick={param.handleDelete}>
        <Delete/>
        </IconButton>
        <IconButton onClick={()=>{setEditing(true)}}>
        <Edit/>
        </IconButton>
        </>
        :
        <>
        <TextField id="standard-basic"  variant="standard" onChange={e => setNewTitle(e.target.value)} />
        <IconButton onClick={()=>{setEditing(false); param.handleEdit(newTitle)}}>
        <Check/>
        </IconButton>
        </>
      }
    </ListItemButton>
  );
};

export default HistoryEntry;
