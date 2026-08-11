const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Signup API
app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;

    // Empty field check
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    // Check if user already exists
    const checkUserQuery = "SELECT * FROM users WHERE email = ?";

    db.query(checkUserQuery, [email], (error, results) => {

        if (error) {
            console.log(error);

            return res.status(500).json({
                message: "Database error"
            });
        }

        // User already exists
        if (results.length > 0) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        // Insert new user
        const insertUserQuery = `
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
        `;

        db.query(
            insertUserQuery,
            [name, email, password],
            (error, result) => {

                if (error) {
                    console.log(error);

                    return res.status(500).json({
                        message: "Failed to create user"
                    });
                }

                return res.status(201).json({
                    message: "User created successfully",
                    userId: result.insertId
                });
            }
        );
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});