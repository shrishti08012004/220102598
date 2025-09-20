import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  IconButton,
  Stack,
  Snackbar,
  Alert
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { generateRandomShortcode, isValidCustomShortcode, isValidUrl } from "../utils/shortcode";
import { addMapping, listMappings } from "../utils/storage";
import logger from "../logger";
import ShortLinkCard from "../components/ShortLinkCard";

export default function UrlShortenerPage() {
  const [rows, setRows] = useState([
    { url: "", ttl: "", shortcode: "" }
  ]);
  const [results, setResults] = useState(listMappings());
  const [msg, setMsg] = useState(null);

  function addRow() {
    if (rows.length >= 5) {
      setMsg({ severity: "warning", text: "Maximum 5 URLs allowed at once." });
      return;
    }
    setRows([...rows, { url: "", ttl: "", shortcode: "" }]);
  }

  function updateRow(i, field, value) {
    const r = [...rows];
    r[i][field] = value;
    setRows(r);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // process rows one by one
    for (let i = 0; i < rows.length; i++) {
      const { url, ttl, shortcode } = rows[i];
      // skip empty row (all fields empty)
      if (!url && !ttl && !shortcode) continue;

      // validate URL
      if (!url || !isValidUrl(url)) {
        setMsg({ severity: "error", text: `Row ${i + 1}: invalid URL` });
        logger.warn("Invalid URL input", { row: i + 1, url });
        return;
      }

      // parse TTL
      let ttlMinutes = parseInt(ttl, 10);
      if (isNaN(ttlMinutes) || ttlMinutes <= 0) ttlMinutes = 30; // default 30

      // validate custom shortcode if provided
      let finalCode = shortcode && shortcode.trim();
      if (finalCode) {
        if (!isValidCustomShortcode(finalCode)) {
          setMsg({ severity: "error", text: `Row ${i + 1}: invalid custom shortcode. Use alphanumeric (3-20 chars).` });
          logger.warn("Invalid shortcode format", { row: i + 1, shortcode });
          return;
        }
      } else {
        // generate unique code (try a few times)
        let tries = 0;
        do {
          finalCode = generateRandomShortcode(6);
          tries++;
          if (tries > 10) finalCode = generateRandomShortcode(8); // expand length if collisions
        } while (listMappings().some(m => m.shortcode === finalCode) && tries < 50);
      }

      // ensure uniqueness
      if (listMappings().some(m => m.shortcode === finalCode)) {
        setMsg({ severity: "error", text: `Row ${i + 1}: shortcode "${finalCode}" already exists.` });
        logger.warn("Shortcode collision on create", { row: i + 1, shortcode: finalCode });
        return;
      }

      // create mapping object
      const createdAt = Date.now();
      const mapping = {
        originalUrl: url,
        shortcode: finalCode,
        createdAt,
        ttlMinutes,
        expiresAt: createdAt + ttlMinutes * 60 * 1000,
        clicks: 0,
        custom: !!shortcode
      };

      try {
        addMapping(mapping);
        logger.info("Shortlink created", mapping);
        setMsg({ severity: "success", text: `Shortlink created: ${window.location.origin}/${finalCode}` });
      } catch (err) {
        setMsg({ severity: "error", text: `Row ${i + 1}: failed to create - ${err.message}` });
        logger.error("Failed to add mapping", { error: err.message, mapping });
        return;
      }
    }

    // refresh results & reset rows
    setResults(listMappings());
    setRows([{ url: "", ttl: "", shortcode: "" }]);
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>URL Shortener</Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {rows.map((r, i) => (
              <React.Fragment key={i}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    value={r.url}
                    onChange={(e) => updateRow(i, "url", e.target.value)}
                    label={`Original URL (Row ${i + 1})`}
                    placeholder="https://example.com/abc"
                    required
                  />
                </Grid>

                <Grid item xs={6} md={3}>
                  <TextField
                    fullWidth
                    type="number"
                    value={r.ttl}
                    onChange={(e) => updateRow(i, "ttl", e.target.value)}
                    label="Validity (minutes) — optional"
                    placeholder="default 30"
                    inputProps={{ min: 1 }}
                  />
                </Grid>

                <Grid item xs={6} md={3}>
                  <TextField
                    fullWidth
                    value={r.shortcode}
                    onChange={(e) => updateRow(i, "shortcode", e.target.value)}
                    label="Custom shortcode — optional (alphanumeric)"
                    placeholder="abcd123 (3-20 chars)"
                  />
                </Grid>
              </React.Fragment>
            ))}

            <Grid item xs={12}>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" type="submit">Create Shortlink(s)</Button>
                <Button variant="outlined" onClick={addRow}>Add another URL (max 5)</Button>
                <Typography sx={{ ml: 2, alignSelf: "center" }} color="text.secondary">
                  You can add up to 5 URLs at once.
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Typography variant="h6" gutterBottom>Recent / Stored Shortlinks</Typography>
      <Grid container spacing={2}>
        {results.length === 0 && <Grid item><Typography color="text.secondary">No short links yet.</Typography></Grid>}
        {results.map(m => (
          <Grid item xs={12} md={6} key={m.shortcode}>
            <ShortLinkCard mapping={m} />
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={!!msg}
        autoHideDuration={6000}
        onClose={() => setMsg(null)}
      >
        {msg && <Alert onClose={() => setMsg(null)} severity={msg.severity} sx={{ width: "100%" }}>{msg.text}</Alert>}
      </Snackbar>
    </Box>
  );
}
