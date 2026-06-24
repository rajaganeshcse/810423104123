import { DatabaseSync } from "node:sqlite";


const db = new DatabaseSync("notifications.db");


db.exec(`
  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

const countRow = db.prepare("SELECT COUNT(*) AS c FROM notifications").get();

if (countRow.c === 0) {
  const insert = db.prepare(
    "INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)"
  );

  const seed = [
    ["TCS Placement Drive", "TCS is visiting campus on 5th July.", "Placement"],
    ["Semester Result Released", "6th semester results are now available.", "Result"],
    ["Tech Fest 2026", "Annual tech fest starts next Monday.", "Event"],
    ["Infosys Placement Drive", "Infosys shortlisted students for interview.", "Placement"],
    ["Backlog Result Update", "Backlog exam results have been published.", "Result"],
    ["Cultural Event", "Cultural night happening this Friday.", "Event"],
  ];

  for (const row of seed) insert.run(...row);
}

export default db;
