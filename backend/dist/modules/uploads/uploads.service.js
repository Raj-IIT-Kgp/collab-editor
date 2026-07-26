"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../common/database/prisma.service");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uuid_1 = require("uuid");
const path = require("path");
let UploadsService = class UploadsService {
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        this.bucketName = this.configService.get('AWS_S3_BUCKET_NAME') || 'coscribe-uploads';
        this.s3Client = new client_s3_1.S3Client({
            region: this.configService.get('AWS_REGION') || 'us-east-1',
            credentials: {
                accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID') || 'mock-key',
                secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY') || 'mock-secret',
            },
        });
    }
    async generatePresignedUrl(userId, presignedUrlDto) {
        const ext = path.extname(presignedUrlDto.fileName);
        const key = `uploads/${userId}/${(0, uuid_1.v4)()}${ext}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            ContentType: presignedUrlDto.fileType,
        });
        try {
            const url = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn: 3600 });
            const fileUrl = `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION') || 'us-east-1'}.amazonaws.com/${key}`;
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
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Could not generate presigned URL');
        }
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map