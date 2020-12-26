const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

// ** Get all the restaurants
app.get('/api/v1/restaurants', async (req, res) => {
	try {
		const results = await db.query('SELECT * FROM restaurants');
		res.json({
			status: 'success',
			results: results.rows.length,
			restaurants: results.rows,
		});
	} catch (err) {
		console.log(err);
	}
});
//** Get Restaurant Detail
app.get('/api/v1/restaurants/:id', async (req, res) => {
	try {
		const results = await db.query('SELECT * FROM restaurants WHERE id=$1', [req.params.id]);
		const reviews = await db.query('SELECT * FROM reviews WHERE restaurant_id=$1', [req.params.id]);
		res.json({
			status: 'success',
			results: results.rows.length,
			data: {
				restaurant: results.rows[0],
				reviews: reviews.rows,
			},
		});
	} catch (err) {
		console.log(err);
	}
});
//** Add Restaurant
app.post('/api/v1/restaurants', async (req, res) => {
	try {
		const results = await db.query(
			'INSERT INTO restaurants (name,location,price_range) VALUES ($1,$2,$3) returning *',
			[req.body.name, req.body.location, req.body.price_range]
		);
		res.json({
			status: 'success',
			results: results.rows.length,
			restaurants: results.rows[0],
		});
	} catch (err) {
		console.log(err);
	}
});
//** Update Restaurant
app.put('/api/v1/restaurants/:id', async (req, res) => {
	try {
		const results = await db.query(
			'UPDATE restaurants SET name=$1,location=$2,price_range=$3 WHERE id=$4  returning *',
			[req.body.name, req.body.location, req.body.price_range, req.params.id]
		);
		res.json({
			status: 'success',
			results: results.rows.length,
			restaurant: results.rows[0],
		});
	} catch (err) {
		console.log(err);
	}
});
//** Delete Restaurant
app.delete('/api/v1/restaurants/:id', async (req, res) => {
	try {
		const results = await db.query('DELETE FROM restaurants WHERE id=$1', [req.params.id]);
		res.status(204).json({
			status: 'success',
		});
	} catch (err) {
		console.log(err);
	}
});
//**Add Review
app.post('/api/v1/restaurants/:id/addReview', async (req, res) => {
	try {
		const response = await db.query(
			'INSERT INTO reviews (restaurant_id,name,review,rating) VALUES ($1,$2,$3,$4) returning *',
			[req.params.id, req.body.name, req.body.review, req.body.rating]
		);
		res.json({
			status: 'success',
			review: response.rows[0],
		});
	} catch (err) {
		console.log(err);
	}
});
const port = process.env.PORT;
app.listen(port || 5000);

console.log(`host is running on http://localhost:${port}`);
