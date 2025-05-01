import { Box, Typography, Paper } from "@mui/material";
import styles from "@styles/components/ChatPanel/ChatPanel.module.scss";

const Welcome = () => {
  return (
    <Box 
      className={styles.chatPanel}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        padding: '2rem'
      }}
    >
      <Paper 
        elevation={3}
        sx={{
          padding: '3rem',
          maxWidth: '600px',
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome to NJU RAG Q&A Platform
        </Typography>
        <Typography variant="body1" paragraph>
          Select an existing session from the history panel or create a new one to start chatting.
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Your conversations will be saved automatically.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Welcome;
