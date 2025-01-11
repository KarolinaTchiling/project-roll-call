import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

interface CircularIndeterminateProps {
    color?: string; // Optional color prop
  }

export default function CircularIndeterminate({ color = 'primary' }: CircularIndeterminateProps) {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress sx={{ color }} />
    </Box>
  );
}