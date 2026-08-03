const { MongoClient, ObjectId } = require('mongodb')

function MongoConstructor(url) {
  this.url = url
  this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true })
  this.connect(url)
}

MongoConstructor.prototype.connect = async function () {
  this.client.connect()
    .then(err => {
      console.log(`mongo connected - ${this.url}`)
    })
}

MongoConstructor.prototype.close = function () {
  this.client.close()
}

const url = "mongodb+srv://root:NDoNwwt1uaLESBcr@clustera.akp7itc.mongodb.net/"

const Mongo = new MongoConstructor(url)

const Collection = 'KAPIKAPI'

module.exports = { ObjectId, Mongo, Collection }