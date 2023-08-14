# TicketMax

TicketMax is a ticket selling web application with queueing system.

- [Website Link](https://ticketmax.yzuhyu.com/)
- [TicketMax Repo](https://github.com/karry0104/ticketMax)
- [TicketMaxCDK Repo](https://github.com/karry0104/ticketMaxCDK)
- [Demo Video](https://drive.google.com/file/d/1D6wqxkoWhpR-iFiO7eHoKHEErXgNdCEE/view?usp=sharing)

## Content

- [SignIn](#signin)
- [Tech Stack](#tech-stack)
- [Architecture Diagram](#architecture-diagram)
- [Database Schema](#database-schema)
- [Features](#features)
- [Queueing System](#queueing-system)
- [Lock the Seat](#lock-the-seat)
- [Load Test](#load-test)

## SignIn

| Testing Account |               |
| --------------- | ------------- |
| Email           | karry@kk.com  |
| Password        | karry         |

## Tech Stack

**Client:** HTML, TailwindCSS, JavaScript 

**Server:** Node.js, Express

**Database:** RDS (MySQL), ElastiCache (Redis)

**Cloud Service(AWS):** EC2, S3, EventBridge, Lambda, SQS, RDS, ElastiCache, API Gateway, CloudFront

**Tool:** RabbitMQ

## Architecture Diagram
<img width="60%" alt="architecture-diagram" src="https://github.com/karry0104/ticketMax/assets/112867897/e7637987-6c91-4526-a275-3aaa8f7dd950">


## Database Schema
<img width="60%" alt="database-schema" src="https://github.com/karry0104/ticketMax/assets/112867897/3054fd84-72f0-4019-ab2b-afa822cab678">



## Features

- Used **SQS FIFO queues** and **Lambda** delay people from accessing the seat selection page, and managed it with **CDK**.
- Achieved the capability to handle 7000 requests within 10 seconds in seat selection page, and process 6000 orders within 40 seconds.
- Deployed the static Front-End page on **S3** and accessed via **CloudFront**.
- Integrated **EventBridge** to pre-warm Lambda before events sell.
- Employed **RabbitMQ** queues to handle expired order and payment system.
- Utilized the **Redis Lua script** to lock the seat, preventing race condition.

## Queueing System

https://github.com/karry0104/ticketMax/assets/112867897/80122793-5317-4ddb-a81c-a8f17ecd9427

- Users enter the SQS FIFO queue with a unique token, which Lambda places it into ElastiCache.
- Short polling is used to check if the token exists in ElastiCache. If found, the user receives the seat map. Otherwise, they receive the number of users ahead in the queue.

## Lock the Seat

https://github.com/karry0104/ticketMax/assets/112867897/e661b4bd-dec6-45c4-bd2b-c6a6e8a90185



- Utilize the Redis Lua script to lock seats, ensuring that each seat can only be selected by one user at a time.
- Only those who successfully reserved a seat will create an order using MySQL, which helps in reducing the workload on the database.

## Load Test

A concert ticketing website may experience high traffic when event go on sale.

Utilized K6 spike test to simulate sudden and very high load when a event start selling.

The testing cover three APIs.

**Enter the queue:** users are allowed to join the SQS FIFO queues with a unique token, which Lambda places it into ElastiCache.
  
<img width="55%" alt="api1" src="https://github.com/karry0104/ticketMax/assets/112867897/995d7a79-e78f-4dc5-bff5-8ad18353e2f3">

</br></br>

**Check unique token:** Lambda will check if unique token exists in ElastiCache by short polling and return seat map.

  
<img width="40%" alt="api2" src="https://github.com/karry0104/ticketMax/assets/112867897/bb6bd632-625c-461f-a655-61248cf3c0df">

</br></br>

**Submit the order:** interact with EC2 server, which handles the completion of the seat selection process.

  
<img width="40%" alt="api2" src="https://github.com/karry0104/ticketMax/assets/112867897/74b68cb5-1e28-4cbf-b6df-5db435b98261">


### Setting
- EC2 instance type
  
| Instance      | vCPU     | Memory    |
| :------------ | :------- | :-------- |
| t4g.small * 1 | 2        | 2 (GiB)   |  

- Parameters for Lambda and SQS
  
| API                | SQS batch | Lambda count |
| :------------      | :-------  | :--------    | 
| Enter the queue    | 5         | 5            |  
| Check unique token | -         | 450          | 

- Spike test configurations
  
| time(s)  | Vus     | 
| :------- | :-------| 
| 10       | 5000    |   

### Report

<img width="70%" alt="load-test-img" src="https://github.com/karry0104/ticketMax/assets/112867897/c8351b1d-fa33-4092-b4cd-62807240ff68">

- The queueing system processes around 7000 users in 10 seconds. 
- Within 40 seconds, approximately 6000 users successfully submit their orders, while about 1000 users remain in the queue. 
- 25% to 35% of the CPU is utilized.

