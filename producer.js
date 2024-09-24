import amqp from 'amqplib';
import 'dotenv/config';

const rabbitSettings = {
  protocol: 'amqp',
  hostname: 'localhost',
  port: 5672,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  vhost: '/',
  authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL'],
};

const connect = async () => {
  const queue = 'employees';
  const newQueue = 'clients';

  const msgs = [
    { name: 'message 1', enterprise: 'interapptiva' },
    { name: 'message 2', enterprise: 'interapptiva' },
    { name: 'message 3', enterprise: 'YouTube' },
    { name: 'message 4', enterprise: 'YouTube' },
  ];

  try {
    const conn = await amqp.connect(rabbitSettings);
    console.log('Connection created...');

    const channel = await conn.createChannel();
    console.log('Channel created...');

    let res = await channel.assertQueue(queue);
    console.log('Queue created...');

    for (let msg in msgs) {
      await channel.sendToQueue(queue, Buffer.from(JSON.stringify(msgs[msg])));
      console.log(`Message sent to queue ${queue}`);
    }

    res = await channel.assertQueue(newQueue);
    console.log('Queue created...');

    for (let msg in msgs) {
      await channel.sendToQueue(
        newQueue,
        Buffer.from(JSON.stringify(msgs[msg]))
      );
      console.log(`Message sent to queue ${newQueue}`);
    }
  } catch (err) {
    console.log(`Error -> ${err}`);
  }
};

connect();
