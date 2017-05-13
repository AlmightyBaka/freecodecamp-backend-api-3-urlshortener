const express = require('express'),
      mongoose = require('mongoose')

const api = require('./api/url-shortener.js')

const app = express(),
      mongoUrl = 'mongodb://localhost:27017/',
      port = process.env.PORT || 8000


mongoose.connect(mongoUrl)
const db = mongoose.connection

db.on('error', error => console.log(`MongoDB connection error: ${error}`))
db.once('open', () => {
    console.log(`connected to MongoDB at ${mongoUrl}`)
    api(app, db)

    app.listen(port, () => {
        console.log(`running on http://localhost:${port}`)
    })
})