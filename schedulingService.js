import amqp from "amqplib";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export default async function consumeFromRabbitMQ() {
  try {
    const connection = await amqp.connect(
      `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}/?heartbeat=60&connection_timeout=30000&rabbitmq_erlang_cookie=${process.env.RABBITMQ_ERLANG_COOKIE}`
    );
    console.log("Connected to RabbitMQ");

    const channel = await connection.createChannel();
    console.log("Channel created");

    const queue = "prescription_queue";
    await channel.assertQueue(queue, { durable: true });
    console.log(`Queue '${queue}' asserted`);

    channel.consume(
      queue,
      async (message) => {
        const prescriptionData = JSON.parse(message.content.toString());
        console.log(`Received prescription message: ${JSON.stringify(prescriptionData)}`);

        await sendEmailReport(
          prescriptionData.pharmacyName,
          prescriptionData.totalAmount,
          prescriptionData.numberOfPrescriptions
        );

        channel.ack(message);
      },
      { noAck: false }
    );
  } catch (error) {
    console.error("Error consuming messages from RabbitMQ:", error);
  }
}

const sendEmailReport = async (pharmacyName, totalAmount, numberOfPrescriptions) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL,
      to: process.env.RECEIVER_GMAIL,
      subject: "Daily Prescription Report",
      text: `To: ${pharmacyName}\nYou have submitted ${numberOfPrescriptions} prescriptions today\nTotal amount is ${totalAmount} TL`,
    };

    await transporter.sendMail(mailOptions);

    console.log(`Email sent to ${pharmacyName}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
