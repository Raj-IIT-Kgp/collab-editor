import { UploadsService } from './uploads.service';
import { PresignedUrlDto } from './dto/presigned-url.dto';
import { User } from '@prisma/client';
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    generatePresignedUrl(user: User, presignedUrlDto: PresignedUrlDto): Promise<{
        uploadUrl: string;
        fileUrl: string;
        uploadId: string;
    }>;
}
