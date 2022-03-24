var Kafka = require('node-rdkafka');
var http = require('axios');

var baseurl = "http://localhost:3000/";

/*var consumer = new Kafka.KafkaConsumer({
  'group.id': 'test-consumer-group',
  'metadata.broker.list': 'localhost:9092',
}, {});*/

var consumer = new Kafka.KafkaConsumer({
  'group.id': 'consumer-group',
  'metadata.broker.list': '172.105.73.219:9092',
}, {});


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