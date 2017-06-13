'use strict'

const api = module.exports = require('express').Router()

api
  .get('/heartbeat', (req, res) => res.send({ok: true}))
  .use('/auth', require('./auth'))
  .use('/users', require('./users'))
  .use('/messages', require('./messages'))
  .use('/sendgrid', require('./sendgrid.js'))
  .use('/gmail', require('./gmail.js'))

// No routes matched? 404.
api.use((req, res) => res.status(404).end())
