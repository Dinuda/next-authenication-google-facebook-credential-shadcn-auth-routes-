import * as AWS from "aws-sdk"
import { env } from "@/env.mjs"

try {
  AWS.config.update({
    region: env.AWS_REGION,
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  })
} catch (error) {
  console.error("AWS config error", error)
}

export const ses = new AWS.SES({ apiVersion: "2010-12-01" })
