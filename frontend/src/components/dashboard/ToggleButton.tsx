import React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

interface ToggleButtonsProps {
    onToggleChange: (newOption: string | null) => void;
    initialValue: string | null; // Initial value from the backend
}

export default function ToggleButtons({ onToggleChange, initialValue }: ToggleButtonsProps) {
    const [alignment, setAlignment] = React.useState<string | null>(initialValue);

    React.useEffect(() => {
        setAlignment(initialValue); // Update alignment when initialValue changes
    }, [initialValue]);

    const handleAlignment = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string | null
    ) => {
        setAlignment(newAlignment);
        onToggleChange(newAlignment);
    };

    return (
        <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={handleAlignment}
            aria-label="text alignment"
        >
            <ToggleButton value="Key Word" aria-label="Key Word">
                By Key Word
            </ToggleButton>
            <ToggleButton value="Event Color" aria-label="Event Color">
                By Event Color
            </ToggleButton>
            <ToggleButton value="Calendar" aria-label="Calendar">
                By Calendar
            </ToggleButton>
        </ToggleButtonGroup>
    );
}

