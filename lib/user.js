import db from "./db";

export function createUser(email, password) {
  const result = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)").run(
    email,
    password
  );

  return result.lastInsertRowid; // Accessing lastInsertRowid from the result object
}
