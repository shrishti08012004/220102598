import React from "react";
import { Paper, Typography, Button, Stack } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { incrementClicks, removeMapping } from "../utils/storage";
import logger from "../logger";

export default function ShortLinkCard({ mapping }) {
  const shortUrl = `${window.location.origin}/${mapping.shortcode}`;

  function handleCopy() {
    if (navigator.clipboard) navigator.clipboard.writeText(shortUrl).then(() => {
      // storing log only, no console
      logger.info("Copied shortlink", { shortcode: mapping.shortcode });
      alert("Copied to clipboard"); // small UI alert (allowed)
    });
  }

  function handleOpen() {
    // open route in same origin — clicking should redirect and will increment clicks in redirect handler
    logger.info("Open shortlink from UI", { shortcode: mapping.shortcode });
    window.location.href = shortUrl;
  }

  function handleDelete() {
    if (!window.confirm("Delete this shortlink?")) return;
    removeMapping(mapping.shortcode);
    logger.info("Deleted shortlink", { shortcode: mapping.shortcode });
    // reload page (simple) to refresh list
    window.location.reload();
  }

  const exp = new Date(mapping.expiresAt).toLocaleString();

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1">{mapping.originalUrl}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{shortUrl}</Typography>
      <Typography variant="caption" display="block">Expires at: {exp}</Typography>
      <Typography variant="caption" display="block">Clicks: {mapping.clicks || 0} {mapping.custom ? "(custom)" : ""}</Typography>

      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Button variant="contained" size="small" onClick={handleOpen}>Open</Button>
        <Button variant="outlined" size="small" startIcon={<ContentCopyIcon />} onClick={handleCopy}>Copy</Button>
        <Button color="error" size="small" onClick={handleDelete}>Delete</Button>
      </Stack>
    </Paper>
  );
}
