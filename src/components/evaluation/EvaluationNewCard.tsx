import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  useTheme,
  Stack,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DescriptionIcon from "@mui/icons-material/Description";
import StorageIcon from "@mui/icons-material/Storage";

interface ImprovedEvaluationCardProps {
  onCreateRag: () => void;
  onCreatePrompt: () => void;
}

const EvaluationNewCard: React.FC<ImprovedEvaluationCardProps> = ({
  onCreateRag,
  onCreatePrompt,
}) => {
  const theme = useTheme();

  return (
    <Card
      elevation={1}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: theme.shadows[4],
          transform: "translateY(-4px)",
        },
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        }
      }}
    >
      <CardContent sx={{ flex: 1, p: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <AddIcon sx={{ color: theme.palette.primary.main }} />
          <Typography variant="h6" fontWeight="bold" ml={1} color="primary">
            Create Evaluation
          </Typography>
        </Box>

        <Typography variant="body2" mb={3} color="text.secondary">
          Create a new evaluation to measure performance
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1.5}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={<StorageIcon />}
            onClick={onCreateRag}
            sx={{
              textAlign: "left",
              justifyContent: "flex-start",
              py: 1,
            }}
          >
            RAG Evaluation
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            startIcon={<DescriptionIcon />}
            onClick={onCreatePrompt}
            sx={{
              textAlign: "left",
              justifyContent: "flex-start",
              py: 1,
            }}
          >
            Prompt Evaluation
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default EvaluationNewCard;
