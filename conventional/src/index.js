import multipartParser from "lambda-multipart-parser";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import { response } from "./utils/response.js";
import crypto from "node:crypto";

export async function handler(event) {
	const {
		files: [file],
	} = await multipartParser.parse(event);

	if (!file || file.fieldname !== 'file') {
		return response(400, { error: "No file found" });
	}

	const s3Client = new S3Client();
	const command = new PutObjectCommand({
		Bucket: process.env.BUCKET,
		Key: `${process.env.BUCKET_PREFIX}${crypto.randomUUID()}-${file.filename}`,
		Body: file.content,
	});

	await s3Client.send(command);

	return response(200, {
		message: "File uploaded",
	});
}
