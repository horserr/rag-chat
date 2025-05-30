import React, { useState, useRef } from 'react';
import {
  Box, TextField, IconButton, Typography, useTheme,
  Tooltip, Badge
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CancelIcon from '@mui/icons-material/Cancel';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';

interface ChatInputAreaProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

type UploadedFile = {
  name: string;
  size: number;
  type: string;
  file: File;
};

const ChatInputArea: React.FC<ChatInputAreaProps> = ({ onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  const MAX_FILES = 5;
  const ALLOWED_TYPES = ['.pdf', '.txt'];
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

  // Add animations for loading state
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.6; }
        100% { opacity: 1; }
      }
      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    // Store the message before clearing the input
    const message = inputText;
    setInputText('');

    // Apply a small delay to improve UX
    setTimeout(() => {
      onSendMessage(message);
    }, 50);

    // Clear uploaded files after sending
    setUploadedFiles([]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: UploadedFile[] = [];

    // Check if we're exceeding max files
    if (uploadedFiles.length + files.length > MAX_FILES) {
      alert(`You can upload a maximum of ${MAX_FILES} files.`);
      return;
    }

    Array.from(files).forEach(file => {
      // Check file type
      const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      const isValidType = ALLOWED_TYPES.includes(fileExt);

      if (!isValidType) {
        alert(`Only ${ALLOWED_TYPES.join(', ')} files are allowed.`);
        return;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} exceeds the maximum size limit.`);
        return;
      }

      newFiles.push({
        name: file.name,
        size: file.size,
        type: file.type,
        file
      });
    });

    setUploadedFiles([...uploadedFiles, ...newFiles]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 20px',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        backgroundColor: '#ffffff',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.03)'
      }}
    >
      {/* File previews */}
      {uploadedFiles.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {uploadedFiles.map((file, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '4px 8px',
                borderRadius: '16px',
                border: '1px solid',
                borderColor: theme.palette.divider,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <InsertDriveFileOutlinedIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
              <Typography variant="caption" sx={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {file.name} ({formatFileSize(file.size)})
              </Typography>
              <IconButton
                size="small"
                onClick={() => removeFile(index)}
                sx={{ ml: 0.5, p: 0.3 }}
              >
                <CancelIcon fontSize="small" sx={{ fontSize: '16px' }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        {/* File upload button */}
        <Tooltip
          title={`Upload files (PDF, TXT only, max ${MAX_FILES} files)`}
          placement="top"
        >
          <IconButton
            disabled={uploadedFiles.length >= MAX_FILES || isLoading}
            color="primary"
            onClick={() => fileInputRef.current?.click()}
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={uploadedFiles.length || null} color="primary">
              <AttachFileIcon color={isLoading ? "disabled" : "primary"} />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          hidden
          multiple
          accept=".pdf,.txt"
          onChange={handleFileUpload}
        />

        <TextField
          fullWidth
          placeholder="Type your message..."
          multiline
          maxRows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isLoading}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              backgroundColor: '#f5f8fc',
              '&.Mui-focused': {
                backgroundColor: '#ffffff',
              },
              '&.Mui-disabled': {
                backgroundColor: '#f5f5f5',
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <IconButton
                color="primary"
                disabled={inputText.trim() === '' || isLoading}
                onClick={handleSendMessage}
                sx={{
                  animation: isLoading ? 'pulse 1.5s infinite ease-in-out' : 'none',
                  '&.Mui-disabled': {
                    color: '#bdbdbd',
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            ),
          }}
        />
      </Box>
    </Box>
  );
};

export default ChatInputArea;
