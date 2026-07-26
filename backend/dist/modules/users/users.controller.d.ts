import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: User): Promise<{
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
    searchByEmail(email: string): Promise<{
        email: string;
        name: string;
        provider: string | null;
        providerId: string | null;
        avatarUrl: string | null;
        id: string;
        isEmailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    updateProfile(user: User, updateDto: UpdateUserDto): Promise<{
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
    getUserById(id: string): Promise<{
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
