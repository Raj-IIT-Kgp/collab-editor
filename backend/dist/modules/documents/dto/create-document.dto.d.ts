import { Role } from '@prisma/client';
export declare class CreateDocumentDto {
    title: string;
    workspaceId: string;
    folderId?: string;
    isPublic?: boolean;
    publicRole?: Role;
}
