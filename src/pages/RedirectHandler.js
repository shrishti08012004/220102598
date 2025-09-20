import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography, Paper, Button } from "@mui/material";
import { getMapping, incrementClicks, removeMapping } from "../utils/storage";
import logger from "../logger";

export default function RedirectHandler() {
  const { code } = useParams();
  const [status, setStatus] = useState({ loading: true, message: "" });

  useEffect(() => {
    if (!code) return;
    const mapping = getMapping(code);
    if (!mapping) {
      setStatus({ loading: false, message: "Short link not found." });
      logger.warn("Redirect attempted for missing shortcode", { shortcode: code });
      return;
    }

    const now = Date.now();
    if (mapping.expiresAt && now > mapping.expiresAt) {
      // expired: remove it and show message
      removeMapping(code);
      setStatus({ loading: false, message: "Short link expired." });
      logger.info("Redirect attempted for expired shortcode", { shortcode: code });
      return;
    }

    // increment clicks and then redirect
    incrementClicks(code);
    logger.info("Redirecting to original URL", { shortcode: code, url: mapping.originalUrl });

    // Use location.assign to perform redirect (client-side)
    window.location.assign(mapping.originalUrl);
  }, [code]);

  return (
    <Paper sx={{ p: 3 }}>
      {status.loading ? (
        <Typography>Redirecting...</Typography>
      ) : (
        <>
          <Typography variant="h6">{status.message}</Typography>
          <Button component={Link} to="/">Back to Shortener</Button>
        </>
      )}
    </Paper>
  );
}
