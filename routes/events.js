const express = require('express');
const router = express.Router();
const db = require('../event_db');
const conn = db.getconnection();

// get events (not suspended)
router.get('/', (req, res) => {
  // select event columns and join other tables
  const sql = `SELECT e.event_id, e.name, e.location, e.start_date, e.end_date, 
              e.ticket_price, e.status, c.name AS category, o.name AS organisation
       FROM events e
       JOIN categories c ON e.category_id = c.category_id
       JOIN organisations o ON e.organisation_id = o.organisation_id
       WHERE e.status != 'suspended'
       ORDER BY e.start_date ASC`

  conn.promise().query(sql)
    .then(([rows]) => res.json(rows))  // return json to frontend
    .catch(err => {
      // console and handle error
      console.log(err.message)
      res.status(500).json({
        error: "Server error"
      })
    });
});

// search events
router.get('/search', (req, res) => {
  // obtain query date/location/category
  const date = req.query.date;
  const location = req.query.location;
  const category = req.query.category;

  let sql = `
    SELECT e.event_id, e.name, e.location, e.start_date, e.end_date, 
           e.ticket_price, e.status, c.name AS category, o.name AS organisation
    FROM events e
    JOIN categories c ON e.category_id = c.category_id
    JOIN organisations o ON e.organisation_id = o.organisation_id
    WHERE e.status != 'suspended'
  `;

  // contact sql and push parameters
  let params = [];

  // date query to search event start date
  if (date) {
    sql += ' AND DATE(e.start_date) >= ?';
    params.push(date);
  }
  // location query to search event location (similar search)
  if (location) {
    sql += ' AND e.location LIKE ?';
    params.push(`%${location}%`);
  }
  // category search to search category name
  if (category) {
    sql += ' AND c.name = ?';
    params.push(category);
  }

  conn.promise().query(sql, params)
    .then(([rows]) => res.json(rows))  // return json to frontend
    .catch(err => {
      // console and handle error
      console.log(err.message)
      res.status(500).json({
        error: "Server error"
      })
    });
});


router.get('/:id', (req, res) => {
  const sql = `
    SELECT e.*, c.name AS category, o.name AS organisation, o.description AS org_description
    FROM events e
    JOIN categories c ON e.category_id = c.category_id
    JOIN organisations o ON e.organisation_id = o.organisation_id
    WHERE e.event_id = ?
  `;

  conn.promise().query(sql, [req.params.id])
    .then(([rows]) => {
      // we should return not found message if query event by id is empty
      if (rows.length === 0) {
        return res.status(404).json({
          error: 'Event not found'
        });
      }
      res.json(rows[0]); // return json to frontend
    })
    .catch(err => {
      // console and handle error
      console.log(err.message)
      res.status(500).json({
        error: "Server error"
      })
    });
});

module.exports = router;
