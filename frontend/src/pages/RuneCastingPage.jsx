import React from "react";
import { useRuneCasting } from "../hooks/useRuneCasting";
import { Container, Typography, Box, Button, Paper, Grid } from "@mui/material";
import RuneCard from "../components/RuneCasting/RuneCard";

const RuneCastingPage = () => {
  const {
    selectedSpread,
    castRunes,
    interpretation,
    isReading,
    selectSpread,
    castRunesForReading,
    saveReading,
    resetReading,
  } = useRuneCasting();

  // Available spreads
  const spreads = [
    { id: "single-rune", name: "Single Rune Reading" },
    { id: "three-rune", name: "Three Rune Spread" },
    { id: "five-rune", name: "Five Rune Spread" },
  ];

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h2"
        component="h1"
        align="center"
        gutterBottom
        sx={{ mt: 4 }}
      >
        Norse Rune Casting
      </Typography>

      {!isReading ? (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Select a Spread
          </Typography>
          <Grid container spacing={3}>
            {spreads.map((spread) => (
              <Grid item xs={12} sm={4} key={spread.id}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "primary.light",
                      color: "white",
                    },
                  }}
                  onClick={() => selectSpread(spread)}
                >
                  <Typography variant="h6">{spread.name}</Typography>
                  <Typography variant="body2">
                    {spread.id === "single-rune" &&
                      "A quick reading for immediate guidance"}
                    {spread.id === "three-rune" &&
                      "Past, Present, and Future insights"}
                    {spread.id === "five-rune" &&
                      "A comprehensive reading for complex situations"}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {selectedSpread && (
            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Selected: {selectedSpread.name}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={castRunesForReading}
              >
                Cast the Runes
              </Button>
            </Box>
          )}
        </Box>
      ) : (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            {selectedSpread.name} - Your Reading
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {castRunes.map((rune, index) => (
              <Grid
                item
                xs={6}
                sm={4}
                md={castRunes.length > 3 ? 2 : 4}
                key={index}
              >
                <RuneCard
                  rune={rune}
                  position={
                    selectedSpread.id === "three-rune"
                      ? ["Past", "Present", "Future"][index]
                      : `Position ${index + 1}`
                  }
                />
              </Grid>
            ))}
          </Grid>

          {interpretation && (
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Interpretation
              </Typography>
              <Typography paragraph>{interpretation.overall}</Typography>

              {interpretation.positions &&
                interpretation.positions.map((pos, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {pos.title}
                    </Typography>
                    <Typography paragraph>{pos.meaning}</Typography>
                  </Box>
                ))}

              <Typography variant="subtitle1" fontWeight="bold">
                Advice
              </Typography>
              <Typography paragraph>{interpretation.advice}</Typography>
            </Paper>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button variant="outlined" color="secondary" onClick={resetReading}>
              New Reading
            </Button>

            <Button variant="contained" color="primary" onClick={saveReading}>
              Save This Reading
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default RuneCastingPage;
