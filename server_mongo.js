require('dotenv').config();
// import modul express yang sudah diinstall 
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
connectDB();
const Movie = require('./models/movies');
const Directors = require('./models/directors');

// membuat sebuah instance app express. variable 'app'
const app = express();
// mendefinisikan port dimana server akan berjalan. port 3000 umum digunakan untuk pengembangan local
const PORT = process.env.PORT || 3300;

app.use(cors());
app.use(express.json());

//rute rute akan ditempatkan disini 

// === ROUTES ===

// Endpoint dasar
app.get('/', (req, res) => {
    res.send('Server API Manajemen Film berjalan!');
});

// Endpoint untuk cek status film api
app.get('/status', (req, res) => {
    res.json({ ok: true, service: 'film-api' });
});

// Endpoint menggunakan Mongoose find ()
app.get('/movies', async (req, res, next) => { // tambahkan next untuk error handler
    try{
        const movies = await Movie.find({});
        res,json(movies);
    } catch (err){
        next(err); //teruskan error ke error handler
    }
});

// Endpoint untuk mongoose findById()
app.get('/movies/:id', async (req, res, next) => {
    try{
        const movie = await Movie.findById(req.params.id);
        if(!movie){
            return res.status(404).json({ error: `Film tidak ditemukan`});
        }
        res.json(movie);
    } catch (err) {
        if (err.kind === `ObjectId`){
            return res.status(404).json({ error: `Format ID tidak valid`});
        }
        next(err);
    }
});


//POST/movies - Endpoint menggunakan Mongoose save()
//Klien akan mengirimkan data   
// directors

app.get('/directors', async (req, res, next) => {
        try {
        const directors = await Directors.find({});
        res.json(directors);
    } catch (err) {
        next (err);
    }
});

app.get('/directors/:id', async (req, res, next) => {
    try {
        const directors = await Directors.findById(req.params.id);
        if (!directors) {
            return res.status(404).json({error: 'Directors tidak ditemukan'});
        }
        res.json(directors);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({error: 'Format ID tidak valid'});
        }
        next(err);
    }
});

app.post('/directors', async (req, res, next) => {
        try {
        const newDirectors = new Directors ({
            name: req.body.name,
            birthYear: req.body.birthYear
        });
        const savedDirectors = await newDirectors.save();
        res.status(201).json(savedDirectors);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({error: err.message});
        }
        next(err);
    }
});

app.put('/directors/:id', async (req, res, next) => {
        try {
        const {name, birthYear} = req.body;
        if (!name || !birthYear) {
            return res.status(400).json({error: 'name, birthYear wajib diisi'});
        }
        const updatedDirectors = await Directors.findByIdAndUpdate(
            req.params.id,
            {name, birthYear},
            {new: true, runValidators: true}
        );
        if (!updatedDirectors) {
            return res.status(404).json({error: 'Directors tidak ditemukan'});
        }
        res.json(updatedDirectors);
    } catch (err) {
        if (err.name == 'ValidationError') {
            return res.status(400).json({error: err.message});
        }
        if (err.kind === 'ObjectID') {
            return res.status(400).json({error: 'Format ID tidak valid'});
        }
        next(err);
    }
});

app.delete('/directors/:id', async (req, res, next) => {
        try {
        const deletedDirectors = await Directors.findByIdAndDelete(req.params.id);
        if (!deletedDirectors) {
            return res.status(404).json({error: 'Directors tidak ditemukan'});
        }
        res.status(204).send();
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({error : 'Format ID tidak valid'});
        }
        next(err);
    }
});

// Fallback 404
app.use((req, res) => {
    res.status(404).json({error: 'Rute tidak ditemukan'});
});

// Error handler (opsional tapi bagus ditambahkan)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({error: 'Terjadi Kesalahan pada server'});
});

app.listen(PORT, () => {
    console.log(`Server aktif di http://localhost:${PORT}`);
});