const express = require('express');
const mysql = require('mysql2');

const app = express();

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'student_management'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }

    console.log('Connected to MySQL database');
});

// EJS setup
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ===============================
// STUDENT LIST
// ===============================

app.get('/', (req, res) => {
    db.query(
        'SELECT * FROM students ORDER BY id DESC',
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }

            res.render('index', {
                students: results
            });
        }
    );
});

// ===============================
// ADD STUDENT
// ===============================

// Show add student form
app.get('/students/add', (req, res) => {
    res.render('add');
});

// Add student
app.post('/students/add', (req, res) => {

    const {
        student_id,
        first_name,
        last_name,
        course,
        year_level,
        email
    } = req.body;

    const sql = `
        INSERT INTO students
        (student_id, first_name, last_name, course, year_level, email)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            student_id,
            first_name,
            last_name,
            course,
            year_level,
            email
        ],
        (err) => {

            if (err) {
                console.error(err);
                return res.status(500).send('Error adding student');
            }

            res.redirect('/');
        }
    );
});

// ===============================
// EDIT STUDENT
// ===============================

// Show edit student form
app.get('/students/edit/:id', (req, res) => {

    const id = req.params.id;

    db.query(
        'SELECT * FROM students WHERE id = ?',
        [id],
        (err, results) => {

            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }

            if (results.length === 0) {
                return res.status(404).send('Student not found');
            }

            res.render('edit', {
                student: results[0]
            });
        }
    );
});

// Update student
app.post('/students/edit/:id', (req, res) => {

    const id = req.params.id;

    const {
        student_id,
        first_name,
        last_name,
        course,
        year_level,
        email
    } = req.body;

    const sql = `
        UPDATE students
        SET student_id = ?,
            first_name = ?,
            last_name = ?,
            course = ?,
            year_level = ?,
            email = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            student_id,
            first_name,
            last_name,
            course,
            year_level,
            email,
            id
        ],
        (err) => {

            if (err) {
                console.error(err);
                return res.status(500).send('Error updating student');
            }

            res.redirect('/');
        }
    );
});

// ===============================
// START SERVER
// ===============================

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});