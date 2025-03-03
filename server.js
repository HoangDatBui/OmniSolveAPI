import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';

import { registerFunction } from './controllers/register.js';
import { signInFunction } from './controllers/signin.js';
import { profileFunction } from './controllers/profile.js';
import { limitationFunction, handleAPICall } from './controllers/limitation.js';

const PORT = process.env.PORT || 4000;
const saltRounds = 10;

const db = knex({
    client: 'pg',
    connection: {
        host: 'postgresql://omnisolve_user:b2d3OqNxZYnPendsqZ7Yv0jAt7rmQorX@dpg-cv2o4uvnoe9s73b8s600-a/omnisolve',
        ssl: true,
    }
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.send("nothing here!") })

app.post('/signin', (req, res) => { signInFunction(req, res, db, bcrypt) })

app.post('/register', (req, res) => { registerFunction(req, res, db, bcrypt, saltRounds) })

app.get('/profile/:id', (req, res) => { profileFunction(req, res, db) })

app.put('/limitation', (req, res) => { limitationFunction(req, res, db) })

app.post('/facerec', (req, res) => { handleAPICall(req, res) })

app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});