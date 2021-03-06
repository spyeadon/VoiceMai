const db = require('APP/db')
const OAuth = db.model('oauths')
const router = require('express').Router()
const gmailBatchAPI = require('../gmail.batch.js')
let gmailInstance;

router.use((req, res, next) => {
  OAuth.findOne({where: {user_id: req.user.id}})
  .then(user => {
    const email = user.profileJson.emails[0].value
    gmailInstance = new gmailBatchAPI(email, user.accessToken, user.refreshToken, res, next)
    next()
  })
  .catch(next)
})

router.get('/labels', (req, res, next) => {
  gmailInstance.getLabels()
})

router.post('/messages', (req, res, next) => {
  const options = Object.assign({maxResults: 15}, req.body)
  gmailInstance.getMessages(options)
})

router.post('/threads', (req, res, next) => {
  const {options, token} = req.body
  gmailInstance.getThreads(options, token)
})

router.get('/account', (req, res, next) => {

})

module.exports = router
