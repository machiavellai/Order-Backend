# Food Order Backend

### Author: Oghene Victor
Full Stack Developer 

## Project Overview
## Postman Documentation link
[text](https://documenter.getpostman.com/view/20318764/2sAY4vghqr)

This project is a **Food Order Backend System** that allows users to sign up, verify their phone numbers using OTPs (One Time Passwords), and perform other customer-related operations. The backend is built using **Node.js**, **Express**, **MongoDB (Mongoose)** for primary data storage, and **Redis** for handling OTPs and caching. It uses JWT for user authentication and implements secure password hashing and salting.

---

## Table of Contents
- [Project Structure](#project-structure)
- [Technologies and Tools](#technologies-and-tools)
- [Installation and Setup](#installation-and-setup)
- [OTP Verification Flow](#otp-verification-flow)
- [Redis Integration](#redis-integration)
- [Customer Signup Flow](#customer-signup-flow)
- [Optimization Tips](#optimization-tips)
- [Learning Resources](#learning-resources)

---

## Project Structure

```bash
.
├── config/                     # Configuration files (MongoDB, Redis)
├── controllers/                # Express Controllers
│   ├── CustomerController.ts    # Customer Signup, OTP Verification logic
├── models/                     # MongoDB Models
│   ├── Customer.ts              # Customer schema
├── services/                   # External services (DB, Redis)
│   ├── Database.ts              # MongoDB connection initialization
│   ├── Redis.ts                 # Redis connection initialization
├── utility/                    # Helper functions
│   ├── OTPUtility.ts            # OTP generation, request handling
│   ├── SignatureUtility.ts      # JWT signing and verification
├── routes/                     # Express routes
│   ├── CustomerRoutes.ts        # Routes for customer endpoints
└── app.ts                      # Express app entry point


Technologies and Tools
Node.js - JavaScript runtime for building server-side applications.
Express.js - Web framework for routing and handling HTTP requests.
MongoDB (Mongoose) - NoSQL database for customer data.
Redis - In-memory data structure store used for caching OTPs.
Twilio - SMS service for sending OTPs (replaced by Redis due to verification limitations).
Class-validator - Used for validating customer input.
JWT (jsonwebtoken) - For generating and verifying tokens.
Bcrypt - Used for password hashing and salting.
UUID - Generates unique identifiers for Redis keys.
Docker (Optional) - For containerizing the application.



