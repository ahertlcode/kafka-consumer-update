var kafka = require("kafka-node");

// const client = new kafka.KafkaClient();

/*const client = new kafka.KafkaClient({kafkaHost: '172.105.73.219:9092'});
console.log(client.connect());
const admin = new kafka.Admin(client);
admin.listTopics((err, res) => {
  console.log('topics', res);
});

const client = new kafka.KafkaClient({kafkaHost: '172.105.73.219:9092'});
const admin = new kafka.Admin(client); // client must be KafkaClient
admin.listGroups((err, res) => {
  console.log('consumerGroups', res);
});*/

var _kafka = new kafka({
    clientId: 'testapp',
    brokers: ['broker:9092'],
    logLevel: logLevel.DEBUG,
    ssl: {
        rejectUnauthorized: false,
        ca: [fs.readFileSync('./cert/ca/certs/ca.cert.pem')],
        cert: fs.readFileSync('./cert/gateway-client/device@netpos-test.com.key.pem')
    }
});
// group.id=
try {
    const consumer = _kafka.consumer({ groupId: 'test-consumer-group' }, { maxWaitTimeInMs: 3000 });

    consumer.connect();
    // consumer.subscribe({ topic: 'external-topic', fromBeginning: true });

    consumer.run({
        eachMessage: async({ topic, partition, message }) => {
            console.log({
                partition: 2,
                offset: message.offset,
                value: message.value.toString(),
            })
        },
    })
} catch (err) {
    console.log('Error while connect : ' + err);
}