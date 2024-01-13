# Prescription Service

This project represents a Prescription Service that interacts with a RabbitMQ message queue for handling prescription data. It includes a scheduling service that triggers tasks and sends daily email reports based on the received prescriptions.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Scheduled Tasks](#scheduled-tasks)
- [Email Reports](#email-reports)
- [Acknowledgments](#acknowledgments)

## Overview

The Prescription Service is built using [Express](https://expressjs.com/) and [Node.js](https://nodejs.org/). It consumes messages from a RabbitMQ queue, processes prescription data, and sends daily email reports. The scheduling service is implemented using [node-cron](https://www.npmjs.com/package/node-cron).

## Prerequisites

Before running the Prescription Service, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (including npm)
- [RabbitMQ](https://www.rabbitmq.com/) server
- [dotenv](https://www.npmjs.com/package/dotenv) for managing environment variables

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/alperengokbak/Prescription-Payment-Service.git
   ```

2. Navigate to the project directory:

   ```bash
   cd your-repo
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Usage

Start the Prescription Service:

```bash
npm run start
```

The service will be running on [http://localhost:3001](http://localhost:3001).

Trigger a task:

```bash
curl http://localhost:3001/trigger-task
```

## Configuration

Adjust the Prescription Service's configuration in the `index.js` file.

- CORS Options:

  ```javascript
  var corsOptions = {
    origin: ["https://prescription-service-kttk.onrender.com", "https://prescription-api-gateway.onrender.com"],
    methods: "GET",
  };
  ```

  Modify the `origin` array based on your needs.

## Scheduled Tasks

The service includes a scheduled task that triggers daily at 1:00 AM (Europe/Istanbul timezone) to consume messages from RabbitMQ.

- Schedule Configuration:

  ```javascript
  cron.schedule(
    "0 1 * * *",
    async () => {
      // ... scheduled task logic
    },
    {
      timezone: "Europe/Istanbul",
    }
  );
  ```

## Email Reports

Prescription data received from RabbitMQ triggers the sending of daily email reports using [nodemailer](https://nodemailer.com/).

- Email Configuration:

  ```javascript
  const sendEmailReport = async (pharmacyName, totalAmount, numberOfPrescriptions) => {
    // ... email configuration logic
  };
  ```

  Update the email configuration based on your email service provider.

## Acknowledgments

- Special thanks to the creators of [Express](https://expressjs.com/), [node-cron](https://www.npmjs.com/package/node-cron), and [nodemailer](https://nodemailer.com/)
