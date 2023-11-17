import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  GetObjectCommandInput,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { CombinedData, DEFAULT_DATA } from "@/lib/storage/data";

const S3_BUCKET = "squanch.college";
const S3_OBJECT = process.env.S3_OBJECT || "dads.json";

let s3Client: S3Client;
export function getS3Client() {
  if (!s3Client) {
    s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    });
  }
  return s3Client;
}

export async function putCombinedDataToS3(data: CombinedData) {
  const input: PutObjectCommandInput = {
    Bucket: S3_BUCKET,
    Key: S3_OBJECT,
    Body: JSON.stringify(data),
  };
  const putObjectCommand = new PutObjectCommand(input);
  try {
    const response = await getS3Client().send(putObjectCommand);
  } catch (error) {
    console.log(error);
  }
}

export async function getCombinedDataFromS3(): Promise<CombinedData> {
  let stats = DEFAULT_DATA;
  const input: GetObjectCommandInput = {
    Bucket: S3_BUCKET,
    Key: S3_OBJECT,
  };
  const getObjectCommand = new GetObjectCommand(input);
  try {
    const response = await getS3Client().send(getObjectCommand);
    if (response.Body) {
      const body = await response.Body.transformToString();
      stats = JSON.parse(body);
    }
  } catch (error) {
    console.log(error);
  }
  return stats;
}
