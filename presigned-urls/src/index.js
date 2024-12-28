import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { response } from "./utils/response.js";
import crypto from "node:crypto";

export async function handler(event) {
	const body = JSON.parse(event.body);

	if (!body.filename) {
		return response(400, { error: "No filename provided!" });
	}

	const { filename } = body;
	const s3Client = new S3Client();
	const command = new PutObjectCommand({
		Bucket: process.env.BUCKET,
		Key: `${process.env.BUCKET_PREFIX}${crypto.randomUUID()}-${filename}`,
	});

	const url = await getSignedUrl(s3Client, command, {
		expiresIn: 60, 
	});

	return response(200, {
		url,
	});
}
