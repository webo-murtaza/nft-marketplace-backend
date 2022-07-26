import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { S3 } from 'aws-sdk';

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

@Injectable()
export class ImageServiceService {

  async upload(path, file) {
    const { originalname } = file;
    const filename = await this.generateFilename(path, originalname);
    const bucketS3 = process.env.AWS_S3_BUCKET_NAME;

    return await this.uploadS3(file, bucketS3, filename);
  }

  async uploadS3(file, bucket, name) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err.stack);
        }
        resolve(process.env.AWS_S3_CLOUDFRONT + data.key);
      });
    });
  }

  getS3() {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  generateFilename(path, filename) {
    return `${path}/${Date.now()}_${filename}`;
  }
}
