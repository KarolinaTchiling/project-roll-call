import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { SwitchWQProps } from '../../types';

const SwitchWQ = styled(Switch)(({  }) => ({
  width: 270, // Updated width
  height: 62, // Updated height
  padding: 7,

  '& .MuiSwitch-switchBase': {
    margin: 8,
    padding: 0,
    transform: 'translateX(-1px)',
    top: '-1px', // Adjusted for new height

    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(136px)', // Adjusted for new width

      '& .MuiSwitch-thumb:before': {
        content: "'Quote'",
        fontSize: '16px', // Increased font size for larger switch
        fontWeight: '700',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: '#fff',
      },

      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#BFCDE5',
      },
    },
  },

  // Thumb (toggle handle)
  '& .MuiSwitch-thumb': {
    backgroundColor: '#4e8799',
    width: 120, // Increased width for larger switch
    height: 48, // Increased height for larger switch
    borderRadius: 45,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: '16px', // Adjusted for "Word"
    color: '#fff',

    '&::before': {
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: '700',
      content: "'Word'",
    },
  },

  // Track (background)
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#BFCDE5',
    borderRadius: 45,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '15px', // Adjusted padding for larger size
    boxSizing: 'border-box',

    // Add labels "Word" and "Quote" inside the track
    '&::before': {
      content: "'Word'",
      fontWeight: '700',
      fontSize: '16px', // Increased font size
      color: '#656C79',
      position: 'absolute',
      left: '40px', // Adjusted for larger width
    },
    '&::after': {
      content: "'Quote'",
      fontWeight: '700',
      fontSize: '16px', // Increased font size
      color: '#656C79',
      position: 'absolute',
      right: '40px', // Adjusted for larger width
    },
  },
}));



const CustomizedSwitches = ({ greeting, toggleGreeting }: SwitchWQProps) => {
  return (
    <>
      <FormGroup>
          <FormControlLabel
            control={<SwitchWQ sx={{ m: 1 }} checked={greeting === 'quote'} onChange={toggleGreeting} />}
            label=""
          />
      </FormGroup>
    </>
  );
};

export default CustomizedSwitches;
