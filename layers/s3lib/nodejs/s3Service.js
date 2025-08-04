// services/s3Service.js
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";


const s3 = new S3Client({ region: "us-east-1" });
const bucketName = "node-api-bucket-for-lambda";
const objectKey = "mockData.json";

// Convert stream to string
async function streamToString(stream) {
  return await new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}

export async function getJSONDataFromS3() {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  const { Body } = await s3.send(command);
  return JSON.parse(await streamToString(Body));
}

export async function saveJSONDataToS3(data) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    Body: JSON.stringify(data),
    ContentType: "application/json",
  });

  await s3.send(command);
}
