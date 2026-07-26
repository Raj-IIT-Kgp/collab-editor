import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/database/prisma.service';
import { PresignedUrlDto } from './dto/presigned-url.dto';
export declare class UploadsService {
    private readonly configService;
    private readonly prisma;
    private s3Client;
    private bucketName;
    constructor(configService: ConfigService, prisma: PrismaService);
    generatePresignedUrl(userId: string, presignedUrlDto: PresignedUrlDto): Promise<{
        uploadUrl: string;
        fileUrl: string;
        uploadId: string;
    }>;
}
