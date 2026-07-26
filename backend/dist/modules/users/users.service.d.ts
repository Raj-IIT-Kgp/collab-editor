import { PrismaService } from '../../common/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        email: string;
        name: string;
        provider: string | null;
        providerId: string | null;
        avatarUrl: string | null;
        id: string;
        isEmailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findById(id: string): Promise<{
        email: string;
        password: string | null;
        name: string;
        provider: string | null;
        providerId: string | null;
        avatarUrl: string | null;
        id: string;
        isEmailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        email: string;
        password: string | null;
        name: string;
        provider: string | null;
        providerId: string | null;
        avatarUrl: string | null;
        id: string;
        isEmailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        email: string;
        name: string;
        provider: string | null;
        providerId: string | null;
        avatarUrl: string | null;
        id: string;
        isEmailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
