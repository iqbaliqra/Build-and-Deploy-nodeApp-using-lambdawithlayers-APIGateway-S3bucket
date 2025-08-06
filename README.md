Here’s the plain text version of your README.md:

---

# Node.js REST API with AWS Lambda and RDS (PostgreSQL)

## Overview

This project demonstrates how to build and deploy a serverless RESTful API using Node.js, AWS Lambda, and Amazon RDS (PostgreSQL). The API supports CRUD operations and is exposed via AWS API Gateway. The Lambda function runs inside an AWS VPC and uses CloudWatch for logging.

---

## Features

- RESTful API with CRUD operations  
- AWS Lambda for serverless compute  
- Amazon RDS (PostgreSQL) for database storage  
- AWS API Gateway for API exposure  
- CloudWatch Logging for monitoring and debugging  
- IAM Role & Policies for secure access  
- Lambda Layers for shared dependencies and runtimes  
- Supports S3 deployment if package size > 10 MB  
- VPC & Security Group configuration for Lambda-RDS connectivity  
- Allows public access (0.0.0.0/0) for local testing (disable in production)  

---

## Technology Stack

- Programming Language: Node.js  
- Database: Amazon RDS (PostgreSQL)  
- Serverless Platform: AWS Lambda  
- API Gateway: REST API  
- Infrastructure: AWS VPC  
- Logging: AWS CloudWatch  

---

## Folder Structure

```
lambda-rds-api/
│
├── functions/
│   └── crudHandler.js        # Lambda CRUD handlers
│
├── layers/
│   └── commonlib/
│       └── nodejs/
│           └── node_modules/ # Shared dependencies (pg, etc.)├── models/└── Item.js               # DB model ── db.js                     # PostgreSQL connection logic
├── serverless.yml            # Deployment configuration
├── package.json
```

---

## Prerequisites

Before you begin, ensure you have:

- AWS Account with required permissions  
- AWS CLI installed and configured  
- Node.js (v22+) installed  
- PostgreSQL client for local testing  
- IAM Role with following policies:  
  - AmazonRDSFullAccess  
  - AWSLambda_FullAccess  
  - CloudWatchFullAccess  

---

## Setup & Deployment Steps

### 1. Create Amazon RDS (PostgreSQL)

- Go to AWS RDS → Create a PostgreSQL instance(Use Free Tier).  
- Configure:  
  - DB Identifier: nodejs-rest-db  
  - Master username: admin  
  - Password: yourpassword  
- Enable Public Access if you want local access.  
- Attach to a VPC (default or custom).  
- Note DB endpoint, username, and password.  

---

### 2. Configure VPC, Subnets, and Security Groups

- Ensure Lambda and RDS are in the same VPC.  
- Create or update Security Group for RDS:  
  - Inbound rule:  
    - Type: PostgreSQL  
    - Port: 5432  
    - Source:  
      - For Lambda only: Lambda security group ID  
      - For Local Testing: 0.0.0.0/0 (⚠ Only for development)  
  - Outbound rule:  
    - Allow All traffic.  
- Attach the same VPC & subnets to Lambda function:  
  - Navigate to Lambda → Configuration → VPC → Edit.  
  - Select the VPC and private subnets where RDS is deployed.  
  - Attach the security group created above.  

---

### 3. Create a Lambda Layer (For Dependencies)

- Create a folder:  
  ```bash
  mkdir node_layer && cd node_layer
  mkdir nodejs && cd nodejs
  npm init -y
  npm install pg sequelize
  cd ..
  zip -r node_layer.zip nodejs
  ```
- Go to AWS Lambda → Layers → Create Layer:  
  - Upload node_layer.zip.  
  - Select Node.js runtime (e.g., nodejs22.x).  

---

### 4. Build Lambda Function

- Create a new folder for Lambda function:  
  ```bash
  mkdir lambda-rest-api && cd lambda-rest-api
  ```
- Create files:  
  - index.js (Handler code)  
  - db.js (Database connection logic)  
- Zip the code:  
  ```bash
  zip -r lambda-function.zip .
  ```
- If zip file > 10 MB, upload it to S3 and link to Lambda.  

---

### 5. Configure Lambda

- Go to AWS Lambda → Create Function:  
  - Runtime: Node.js 22.x  
  - Add the Layer created earlier.  
- Set Handler to functions/curdHandler.js.  
- Attach IAM Role with:  
  - AmazonRDSFullAccess  
  - AWSLambda_FullAccess  
  - CloudWatchFullAccess  
- Enable VPC Access:  
  - Attach the same VPC, subnets, and security group as RDS.  

---

### 6. Connect Lambda to RDS
  ```
- Set Environment Variables in Lambda:  
  ```
  DB_HOST=your-rds-endpoint
  DB_USER=admin
  DB_PASS=yourpassword
  DB_NAME=yourdbname

### 7. API Gateway Integration

- Go to API Gateway → Create API → REST API.  
- Create resources:  
  - /items → Methods: GET, POST  
  - /items/{id} → Methods: GET, PUT, DELETE  
- Integrate each method with Lambda Function and Lambda proxy on otherwise event not pass to the lambda.  
- Deploy API to Stage (e.g., prod).  
- Copy the Invoke URL.  

---

### 8. Test API

- Use Postman or cURL:  
  ```bash
  curl -X GET https://<api-id>.execute-api.<region>.amazonaws.com/default/nodejs-lambda-function-api
  ```

---

## Logging

- Logs are available in AWS CloudWatch Logs:  
  - Navigate to CloudWatch → Logs → Log Groups → Lambda Log Group.  

---

## Environment Variables

| Key      | Description   |
| -------- | ------------- |
| DB_HOST  | RDS Endpoint  |
| DB_USER  | DB Username   |
| DB_PASS  | DB Password   |
| DB_NAME  | Database Name |

---

## Security

- Development Mode (Local Testing):  
  - RDS Security Group Inbound → Port 5432 → 0.0.0.0/0  
- Production Mode:  
  - Remove 0.0.0.0/0 and allow only Lambda Security Group.  
- Never hardcode credentials; use AWS Secrets Manager for production.  

---

## Deployment Notes

- If zip > 10MB, upload to S3 and link to Lambda.  
- Ensure Layers contain all shared dependencies.  

---

## License

This project is licensed under the MIT License.

--- 

