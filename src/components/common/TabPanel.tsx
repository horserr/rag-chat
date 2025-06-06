import React from 'react';
import { Box } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  id?: string;
  ariaLabelledBy?: string;
}

const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  id = `tabpanel-${index}`,
  ariaLabelledBy = `tab-${index}`,
  ...other
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={id}
      aria-labelledby={ariaLabelledBy}
      {...other}
      style={{ height: 'calc(100% - 48px)', overflow: 'auto' }}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export default TabPanel;
