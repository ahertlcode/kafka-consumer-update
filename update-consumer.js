var { Kafka, logLevel } = require('kafkajs');
var http = require('axios');
var fs = require("fs");

var baseurl = "http://localhost:3000/";

var _kafka = new Kafka({
  clientId: 'testapp',
  brokers: ['kafka1:9092'],
  logLevel: logLevel.INFO
});

var consumer = _kafka.consumer({groupId: 'test-consumer-group'});

var run = async () => {
  await consumer.connect();
  await consumer.subscribe({topic: 'pos-reversal.notification.event'});
  await consumer.run({
    eachMessage: async ({topic, partition, message}) => {
      const prefix = `${new Date()} - ${topic}[${partition} | ${message}] / ${message.timestamp}`;
      const ddata = `- ${prefix} ${message.key}#${message.value}\n`;
      // fs.writeFile('testdata.txt', ddata, { flag: 'a+' }, err => {});
      console.log(ddata);
    },
  });
}

// setInterval(() => {
// }, 10000);

run().catch(e => {
  const errdata = `${new Date()} - [testapp] ${e.message}\n`;
  // fs.writeFile('errdata.txt', errdata, { flag: 'a+' }, err => {});
  console.log(errdata);
});

/*

var updateConsumer = consumer.connect();

updateConsumer.on('ready', () => {
  console.log('update consumer ready..');
  updateConsumer.subscribe(["pos-reversal.notification.event"]);
  updateConsumer.consume();
}).on('data', function(data) {
  const payload = JSON.parse(data.value);
  var tid = Math.floor(Math.random()*1000);
  http.put(baseurl+'pos-transaction/'+tid, payload)
    .then((res) => {
      console.log(`Status: ${res.status}`);
      console.log(`Message: `, res.data);
    })
    .catch((err) => {
      console.log(err);
    });
});
*/