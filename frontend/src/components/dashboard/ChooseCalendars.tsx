import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

interface Calendar {
  calendarID: string;
  colorID: string;
  include: boolean;
  summary: string;
}

interface TransferListProps {
  refreshKey: number; // Add a prop to trigger re-fetching of calendars
}

function not<T>(a: readonly T[], b: readonly T[]) {
  return a.filter((value) => !b.includes(value));
}

function intersection<T>(a: readonly T[], b: readonly T[]) {
  return a.filter((value) => b.includes(value));
}

const TransferList: React.FC<TransferListProps> = ({ refreshKey }) => {
  const [checked, setChecked] = useState<readonly Calendar[]>([]);
  const [left, setLeft] = useState<readonly Calendar[]>([]);
  const [right, setRight] = useState<readonly Calendar[]>([]);

  // Fetch calendars from the backend
  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/setting/get_settings`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Split calendars based on the `include` flag (reversed sides)
        const fetchedCalendars: Calendar[] = data.calendars || [];
        const includedCalendars = fetchedCalendars.filter((calendar) => calendar.include);
        const excludedCalendars = fetchedCalendars.filter((calendar) => !calendar.include);

        setLeft(includedCalendars); // Now "include: true" is on the left
        setRight(excludedCalendars); // Now "include: false" is on the right
      } catch (err) {
        console.error("Error fetching calendars:", err);
      }
    };

    fetchCalendars();
  }, [refreshKey]);

  const updateIncludeStatus = async (calendarID: string, include: boolean) => {
    try {
      await fetch(`${import.meta.env.VITE_BASE_URL}/setting/update_calendar_include`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ calendarID, include }),
      });
    } catch (err) {
      console.error(`Error updating include status for calendar ${calendarID}:`, err);
    }
  };

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: Calendar) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = async () => {
    for (const calendar of left) {
      await updateIncludeStatus(calendar.calendarID, false);
    }
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleCheckedRight = async () => {
    for (const calendar of leftChecked) {
      await updateIncludeStatus(calendar.calendarID, false);
    }
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = async () => {
    for (const calendar of rightChecked) {
      await updateIncludeStatus(calendar.calendarID, true);
    }
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = async () => {
    for (const calendar of right) {
      await updateIncludeStatus(calendar.calendarID, true);
    }
    setLeft(left.concat(right));
    setRight([]);
  };

  const customList = (items: readonly Calendar[]) => (
    <Paper sx={{ width: 230, height: 350, overflow: "auto", backgroundColor: "#CAEBF6", borderRadius: 2, border: "0.8px solid grey", boxShadow: "none",}}>
      <List dense component="div" role="list">
        {items.map((value: Calendar) => {
          const labelId = `transfer-list-item-${value.calendarID}-label`;

          return (
            <ListItemButton
              key={value.calendarID}
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.includes(value)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value.summary} />
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );

  return (
    <Grid container spacing={2} sx={{ justifyContent: "center", alignItems: "center" }}>
      <Grid item>{customList(left)}</Grid>
      <Grid item>
        <Grid container direction="column" sx={{ alignItems: "center"}}>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleAllRight}
            disabled={left.length === 0}
            aria-label="move all right"
          >
            ≫
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleAllLeft}
            disabled={right.length === 0}
            aria-label="move all left"
          >
            ≪
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList(right)}</Grid>
    </Grid>
  );
};

export default TransferList;
