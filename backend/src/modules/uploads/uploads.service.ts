import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/database/prisma.service';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PresignedUrlDto } from './dto/presigned-url.dto';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class UploadsService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME') || 'coscribe-uploads';
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION') || 'us-east-1',
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || 'mock-key',
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || 'mock-secret',
      },
    });
  }

  async generatePresignedUrl(userId: string, presignedUrlDto: PresignedUrlDto) {
    const ext = path.extname(presignedUrlDto.fileName);
    const key = `uploads/${userId}/${uuidv4()}${ext}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: presignedUrlDto.fileType,
    });

    try {
      const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
      const fileUrl = `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION') || 'us-east-1'}.amazonaws.com/${key}`;

      // Register the upload intent in the database
      const uploadRecord = await this.prisma.upload.create({
        data: {
          userId,
          fileName: presignedUrlDto.fileName,
          fileType: presignedUrlDto.fileType,
          fileSize: presignedUrlDto.fileSize,
          fileUrl,
        },
      });

      return {
        uploadUrl: url,
        fileUrl,
        uploadId: uploadRecord.id,
      };
    } catch (error) {
      throw new InternalServerErrorException('Could not generate presigned URL');
    }
  }
}
