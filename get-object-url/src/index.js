import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { response } from "./utils/response.js";

export async function handler(event) {
	const body = JSON.parse(event.body);

	if (!body.filename) {
		return response(400, { error: "No filename provided!" });
	}

	const { filename } = body;
	const s3Client = new S3Client();
	const command = new GetObjectCommand({
		Bucket: process.env.BUCKET,
		Key: `${process.env.BUCKET_PREFIX}${filename}`,
	});

	const url = await getSignedUrl(s3Client, command, {
		expiresIn: 30, 
	});

	return response(200, {
		url,
	});
}
