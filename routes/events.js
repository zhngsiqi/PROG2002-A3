const express = require('express');
const router = express.Router();
const db = require('../event_db');
const conn = db.getconnection();

// get events (not suspended)
router.get('/', (req, res) => {
  // select event columns and join other tables
  const sql = `SELECT e.*, c.name AS category, o.name AS organisation
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

router.post('/', (req, res) => {
  const {
    organisation_id,
    category_id,
    name,
    description,
    location,
    start_date,
    end_date,
    ticket_price = 0,
    goal_amount = 0,
    raised_amount = 0,
    latitude,
    longitude
  } = req.body;

  // validate fields
  if (!organisation_id || !category_id) {
    return res.status(400).json({ error: 'Organisation and category are required' });
  }

  if (!name || name.length > 100) {
    return res.status(400).json({ error: 'Name is required and max length 100' });
  }

  if (description && description.length > 500) {
    return res.status(400).json({ error: 'Description max length 500' });
  }

  if (!location || location.length > 150) {
    return res.status(400).json({ error: 'Location is required and max length 150' });
  }

  if (!start_date || !end_date) {
    return res.status(400).json({ error: 'Start date and end date are required' });
  }

  if (new Date(end_date) < new Date(start_date)) {
    return res.status(400).json({ error: 'End date must be after start date' });
  }

  if (ticket_price < 0 || goal_amount < 0 || raised_amount < 0) {
    return res.status(400).json({ error: 'Amounts cannot be negative' });
  }

  if (latitude != null && (latitude < -90 || latitude > 90)) {
    return res.status(400).json({ error: 'Latitude must be between -90 and 90' });
  }

  if (longitude != null && (longitude < -180 || longitude > 180)) {
    return res.status(400).json({ error: 'Longitude must be between -180 and 180' });
  }

  // insert to db
  const sql = `
    INSERT INTO events 
      (organisation_id, category_id, name, description, location, start_date, end_date, ticket_price, goal_amount, raised_amount, latitude, longitude) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  conn.promise().query(sql, [
    organisation_id, category_id, name, description, location, start_date, end_date, ticket_price, goal_amount, raised_amount, latitude, longitude
  ])
    .then(([result]) => {
      res.status(201).json({
        message: 'Event added successfully',
        event_id: result.insertId
      });
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({
        error: "Server error"
      });
    });
});

router.put('/:id', (req, res) => {
  const {
    organisation_id,
    category_id,
    name,
    description,
    location,
    start_date,
    end_date,
    ticket_price,
    goal_amount,
    raised_amount,
    latitude,
    longitude
  } = req.body;

  // validate fields
  if (!organisation_id || !category_id) {
    return res.status(400).json({ error: 'Organisation and category are required' });
  }

  if (!name || name.length > 100) {
    return res.status(400).json({ error: 'Name is required and max length 100' });
  }

  if (description && description.length > 500) {
    return res.status(400).json({ error: 'Description max length 500' });
  }

  if (!location || location.length > 150) {
    return res.status(400).json({ error: 'Location is required and max length 150' });
  }

  if (!start_date || !end_date) {
    return res.status(400).json({ error: 'Start date and end date are required' });
  }

  if (new Date(end_date) < new Date(start_date)) {
    return res.status(400).json({ error: 'End date must be after start date' });
  }

  if (ticket_price < 0 || goal_amount < 0 || raised_amount < 0) {
    return res.status(400).json({ error: 'Amounts cannot be negative' });
  }

  if (latitude != null && (latitude < -90 || latitude > 90)) {
    return res.status(400).json({ error: 'Latitude must be between -90 and 90' });
  }

  if (longitude != null && (longitude < -180 || longitude > 180)) {
    return res.status(400).json({ error: 'Longitude must be between -180 and 180' });
  }

  const sql = `
    UPDATE events SET 
      organisation_id = ?, 
      category_id = ?, 
      name = ?, 
      description = ?, 
      location = ?, 
      start_date = ?, 
      end_date = ?, 
      ticket_price = ?, 
      goal_amount = ?, 
      raised_amount = ?, 
      latitude = ?, 
      longitude = ?
    WHERE event_id = ?
  `;

  conn.promise().query(sql, [
    organisation_id, category_id, name, description, location, start_date, end_date, ticket_price, goal_amount, raised_amount, latitude, longitude, req.params.id
  ])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        return res.status(404).json({
          error: 'Event not found'
        });
      }
      res.json({
        message: 'Event updated successfully'
      });
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({
        error: "Server error"
      });
    });
});

module.exports = router;
