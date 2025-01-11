import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface BasicTextFieldsProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  buttonLabel?: string;
}

export default function BasicTextFields({
  label,
  value,
  onChange,
  onSubmit,
  buttonLabel = '+',
}: BasicTextFieldsProps) {
  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        alignItems: 'center', // Align items in the center vertically
        gap: 1, // Add space between TextField and Button
      }}
      noValidate
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault(); // Prevent default form submission
        onSubmit(); // Trigger onSubmit handler
      }}
    >
      <TextField
        id="outlined-basic"
        label={label}
        variant="outlined"
        size="small"
        value={value}
        onChange={onChange}
        sx={{ width: '14ch' }}
      />
      <Button
        variant="text" // Use text-only button style
        size="small"
        onClick={onSubmit}
        sx={{
          width: '30px',       // Set width
          height: '30px',      // Set height to match width for a circular hitbox
          minWidth: '30px',    // Ensure consistent sizing
          borderRadius: '50%', // Make it circular
          padding: 0,          // Remove extra padding
          fontSize: '1.2rem',  // Adjust font size for "+"
          lineHeight: '1',     // Align text properly
          border: '1px solid transparent', // Optional: Adjust as needed for hover effect
          '&:hover': {
            border: '1px solid gray', // Add a subtle hover effect
          },
        }}
      >
        {buttonLabel}
      </Button>
    </Box>
  );
}
