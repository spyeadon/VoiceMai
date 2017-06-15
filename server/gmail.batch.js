const {filterLabels} = require('./utils.js')
var googleBatch = require('google-batch');
var google = googleBatch.require('googleapis');


class gmailBatchAPI {
  constructor(email, accessToken, refreshToken, res){
    this.email = email
    this.Oauth2Inst = new google.auth.OAuth2
    this.Oauth2Inst.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    })
    this.batch = new googleBatch()
    this.batch.setAuth(this.Oauth2Inst)
    this.gmail = google.gmail({version: 'v1'})
    this.res = res
  }

  getLabels() {
    var options = {userId: this.email, googleBatch: true}
    this.batch.add(this.gmail.users.labels.list(options))
    this.batch.exec((err, responses, errorDetails) => {
      if (err) return console.log('The API returned an error: ' + err);
      const labels = filterLabels(responses[0].body.labels)
      this.batch.clear()
      this.res.json(labels)
    })
  }

  getMessages(opts) {
    var getOptions = {userId: this.email, googleBatch: true}
    var listOptions = Object.assign({userId: this.email, googleBatch: true}, opts)

    this.batch.add(this.gmail.users.messages.list(listOptions))
    this.batch.exec((err, responses, errorDetails) => {
      if (err) return console.log('The batch API returned an error: ' + err)
      console.log('messages LIST responses: ', responses[0].body.messages)
      this.batch.clear()
      responses[0].body.messages.forEach(message => {
        getOptions.id = message.id
        this.batch.add(this.gmail.users.messages.get(getOptions))
      })
      this.batch.exec((error, resps, errorDeets) => {
        if (error) return console.log('The batch API returned an error: ' + error)
        console.log('messages GET responses: ', resps)
        this.res.json(resps)
      })
      this.batch.clear()
    })
  }

  getThreads(opts) {
    var getOptions = {userId: this.email, googleBatch: true}
    var listOptions = Object.assign({userId: this.email, googleBatch: true}, opts)

    this.batch.add(this.gmail.users.threads.list(listOptions))
    this.batch.exec((err, responses, errorDetails) => {
      if (err) return console.log('The batch API returned an error: ' + err)
      console.log('thread LIST responses: ', responses[0].body.threads)
      this.batch.clear()
      responses[0].body.threads.forEach(thread => {
        getOptions.id = thread.id
        this.batch.add(this.gmail.users.threads.get(getOptions))
      })
      this.batch.exec((error, resps, errorDeets) => {
        if (error) return console.log('The batch API returned an error: ' + error)
        console.log('thread GET responses: ', resps[0].body)
        console.log('thread GET response body.messages: ', resps[0].body.messages)
        this.res.json(resps)
      })
      this.batch.clear()
    })
  }

}

module.exports = gmailBatchAPI
