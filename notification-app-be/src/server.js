import http from "node:http";
import db from "./db.js";

const PORT = 5000;
const PAGE_SIZE = 5;

function send(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", 
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === "/notifications" && req.method === "GET") {
    const type = url.searchParams.get("type");
    const page = parseInt(url.searchParams.get("page") || "1", 10) || 1;
    const offset = (page - 1) * PAGE_SIZE;

    const whereClause = type && type !== "All" ? "WHERE type = ?" : "";
    const params = type && type !== "All" ? [type] : [];

    const total = db
      .prepare(`SELECT COUNT(*) AS c FROM notifications ${whereClause}`)
      .get(...params).c;

    const notifications = db
      .prepare(
        `SELECT * FROM notifications ${whereClause}
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`
      )
      .all(...params, PAGE_SIZE, offset);

    send(res, 200, {
      notifications,
      total,
      totalPages: Math.ceil(total / PAGE_SIZE) || 1,
      page,
    });
    return;
  }

  send(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`Notification backend running on http://localhost:${PORT}`);
});
