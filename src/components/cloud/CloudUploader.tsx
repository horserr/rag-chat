import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Paper,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import LinkIcon from "@mui/icons-material/Link";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";


interface UploadedFile {
    name: string;
    type: "file" | "url";
    content: File | string;
}

const CloudUploader: React.FC = () => {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [url, setUrl] = useState("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles) {
            const newFiles: UploadedFile[] = Array.from(selectedFiles).map((file) => ({
                name: file.name,
                type: "file",
                content: file,
            }));
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const handleAddUrl = () => {
        if (url.trim()) {
            setFiles((prev) => [
                ...prev,
                { name: url, type: "url", content: url },
            ]);
            setUrl("");
        }
    };

    const handleDelete = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <Paper sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
                上传文件或输入链接
            </Typography>

            {/* 文件上传 */}
            <Button
                variant="contained"
                component="label"
                startIcon={<UploadFileIcon />}
                sx={{ marginBottom: 2 }}
            >
                选择文件
                <input
                    type="file"
                    accept=".pdf"
                    hidden
                    multiple
                    onChange={handleFileChange}
                />
            </Button>

            {/* URL 上传 */}
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                    label="输入文件 URL"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <Button variant="outlined" onClick={handleAddUrl}>
                    添加
                </Button>
            </Box>

            {/* 文件/链接列表 */}
            <List>
                {files.map((file, index) => (
                    <ListItem key={index} divider>
                        <ListItemText
                            primary={
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    {file.type === "url" ? (
                                        <LinkIcon sx={{ color: "#1976d2" }} />
                                    ) : file.name.endsWith(".pdf") ? (
                                        <PictureAsPdfIcon sx={{ color: "#d32f2f" }} />
                                    ) : (
                                        <InsertDriveFileIcon />
                                    )}
                                    {file.name}
                                </Box>
                            }
                            secondary={file.type === "url" ? "URL" : "本地文件"}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleDelete(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default CloudUploader;
