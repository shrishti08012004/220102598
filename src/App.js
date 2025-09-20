import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import UrlShortenerPage from "./pages/UrlShortenerPage";
import StatsPage from "./pages/StatsPage";
import RedirectHandler from "./pages/RedirectHandler";

export default function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            React URL Shortener
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Shorten
          </Button>
          <Button color="inherit" component={Link} to="/stats">
            Stats
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<UrlShortenerPage />} />
          <Route path="/stats" element={<StatsPage />} />
          {/* Redirect route (catch shortcodes at root like /abcd1 ) */}
          <Route path="/:code" element={<RedirectHandler />} />
        </Routes>
      </Container>
    </>
  );
}
