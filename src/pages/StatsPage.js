import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";
import { listMappings } from "../utils/storage";

export default function StatsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(listMappings());
  }, []);

  return (
    <div>
      <Typography variant="h5" gutterBottom>URL Shortener — Statistics</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Shortcode</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell>TTL (min)</TableCell>
              <TableCell>Clicks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(it => (
              <TableRow key={it.shortcode}>
                <TableCell>{it.shortcode}</TableCell>
                <TableCell style={{ maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.originalUrl}</TableCell>
                <TableCell>{new Date(it.createdAt).toLocaleString()}</TableCell>
                <TableCell>{new Date(it.expiresAt).toLocaleString()}</TableCell>
                <TableCell>{it.ttlMinutes}</TableCell>
                <TableCell>{it.clicks || 0}</TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">No short links created yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
