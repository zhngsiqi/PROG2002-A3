const express = require('express');
const router = express.Router();
const db = require('../event_db');
const conn = db.getconnection();

// Retrieve all registration records for the specified event
router.get('/:event_id', (req, res) => {
  const sql = `
    SELECT r.registration_id, r.full_name, r.email, r.phone, 
           r.tickets, r.total_amount, r.registration_date
    FROM registrations r
    WHERE r.event_id = ?
    ORDER BY r.registration_date DESC
  `;

  conn.promise().query(sql, [req.params.event_id])
    .then(([rows]) => {
      res.json(rows); // Return to the registration list
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({ error: 'Server error' });
    });
});

// Add a new registration record
// The request body should include: event_id, full_name, email, phone, tickets
router.post('/', (req, res) => {
  const { event_id, full_name, email, phone, tickets } = req.body;

  // Check required fields
  if (!event_id || !full_name || !email || !tickets) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // First, check if the event has been registered
  const checkSql = `
    SELECT registration_id FROM registrations 
    WHERE event_id = ? AND email = ?
  `;
  conn.promise().query(checkSql, [event_id, email])
    .then(([rows]) => {
      if (rows.length > 0) {
        // The user has registered for this event
        return res.status(400).json({
          error: 'You have already registered for this event'
        });
      }

      // Check ticket prices
      const priceSql = 'SELECT ticket_price FROM events WHERE event_id = ?';
      return conn.promise().query(priceSql, [event_id]);
    })
    .then(([rows]) => {
      if (!rows) return;

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }

      // calculate total amount
      const ticket_price = rows[0].ticket_price;
      const total_amount = ticket_price * tickets;

      const insertSql = `
        INSERT INTO registrations (event_id, full_name, email, phone, tickets, total_amount)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      return conn.promise().query(insertSql, [
        event_id, full_name, email, phone, tickets, total_amount
      ]);
    })
    .then(([result]) => {
      if (!result) return; // If you have already responded earlier, do not continue
      res.status(201).json({
        message: 'Registration successful',
        registration_id: result.insertId
      });
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({ error: 'Server error' });
    });
});

// Retrieve all registration records
router.get('/', (req, res) => {
  const sql = `
    SELECT r.registration_id, r.full_name, r.email, r.phone, 
           r.tickets, r.total_amount, r.registration_date,
           e.name AS event_name, e.start_date AS event_start_date
    FROM registrations r
    JOIN events e ON r.event_id = e.event_id
    ORDER BY r.registration_date DESC
  `;

  conn.promise().query(sql)
    .then(([rows]) => res.json(rows))
    .catch(err => {
      console.log(err.message);
      res.status(500).json({
        error: 'Server error'
      });
    });
});

// Add registration
router.post('/', (req, res) => {
  const { event_id, full_name, email, phone, tickets } = req.body;

  // validate fields
  if (!event_id || !full_name || !email || !tickets || tickets <= 0) {
    return res.status(400).json({
      error: 'Missing or invalid required fields'
    });
  }

  // check if user already registered for the event
  const checkSql = `SELECT registration_id FROM registrations WHERE event_id = ? AND email = ?`;
  conn.promise().query(checkSql, [event_id, email])
    .then(([rows]) => {
      if (rows.length > 0) {
        return res.status(400).json({
          error: 'You have already registered for this event'
        });
      }

      // get ticket price
      const priceSql = 'SELECT ticket_price FROM events WHERE event_id = ?';
      return conn.promise().query(priceSql, [event_id]);
    })
    .then(([rows]) => {
      if (!rows) return;
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }

      // calculate total amount
      const ticket_price = rows[0].ticket_price;
      const total_amount = ticket_price * tickets;

      // insert sql
      const insertSql = `
        INSERT INTO registrations (event_id, full_name, email, phone, tickets, total_amount)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      return conn.promise().query(insertSql, [event_id, full_name, email, phone, tickets, total_amount]);
    })
    .then(([result]) => {
      if (!result) return;
      res.status(201).json({
        message: 'Registration added successfully',
        registration_id: result.insertId
      });
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({
        error: 'Server error'
      });
    });
});

router.put('/:id', (req, res) => {
  const { full_name, email, phone, tickets } = req.body;

  // validate fields
  if (!full_name || !email || !tickets || tickets <= 0) {
    return res.status(400).json({
      error: 'Missing or invalid required fields'
    });
  }

  // get registration's event_id to recalc total_amount
  const getEventSql = 'SELECT event_id FROM registrations WHERE registration_id = ?';
  conn.promise().query(getEventSql, [req.params.id])
    .then(([rows]) => {
      if (rows.length === 0) {
        return res.status(404).json({
          error: 'Registration not found'
        });
      }
      const event_id = rows[0].event_id;

      // get ticket price
      const priceSql = 'SELECT ticket_price FROM events WHERE event_id = ?';
      return conn.promise().query(priceSql, [event_id])
        .then(([priceRows]) => {
          if (priceRows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
          }

          // calculate total amount
          const ticket_price = priceRows[0].ticket_price;
          const total_amount = ticket_price * tickets;

          // update sql
          const updateSql = `
            UPDATE registrations 
            SET full_name = ?, email = ?, phone = ?, tickets = ?, total_amount = ?
            WHERE registration_id = ?
          `;
          return conn.promise().query(updateSql, [full_name, email, phone, tickets, total_amount, req.params.id]);
        });
    })
    .then(([result]) => {
      if (!result) return;
      res.json({
        message: 'Registration updated successfully'
      });
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({
        error: 'Server error'
      });
    });
});

module.exports = router;
