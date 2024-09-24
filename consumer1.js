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
  const queue = 'clients';
  const enterprise = 'interapptiva';

  try {
    const conn = await amqp.connect(rabbitSettings);
    console.log('Connection created...');

    const channel = await conn.createChannel();
    console.log('Channel created...');

    console.log(`Waiting for messages from ${enterprise}`);
    channel.consume(queue, (message) => {
      let employee = JSON.parse(message.content.toString());
      console.log(`Received employee ${employee.name}`);
      console.log(employee);

      channel.ack(message);
      // if (employee.enterprise === enterprise) {
      //   console.log('Deleted message from queue...\n');
      // } else {
      //   console.log(`That message is not for me. I'll not delete it...`);
      // }
    });
  } catch (err) {
    console.log(`Error -> ${err}`);
  }
};

connect();
