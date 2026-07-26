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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcryptjs");
const mail_service_1 = require("../../mail/mail.service");
const prisma_service_1 = require("../../common/database/prisma.service");
const uuid_1 = require("uuid");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService, mailService, prisma) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.mailService = mailService;
        this.prisma = prisma;
    }
    async register(registerDto) {
        const user = await this.usersService.create(registerDto);
        const verificationToken = (0, uuid_1.v4)();
        await this.mailService.sendVerificationEmail(user.email, verificationToken);
        return this.generateTokens(user);
    }
    async login(loginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user || !user.password) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.generateTokens(user);
    }
    async googleLogin(req) {
        if (!req.user) {
            throw new common_1.BadRequestException('No user from google');
        }
        let user = await this.usersService.findByEmail(req.user.email);
        if (!user) {
            user = await this.usersService.create({
                email: req.user.email,
                name: `${req.user.firstName} ${req.user.lastName}`,
                provider: 'google',
                providerId: req.user.providerId,
                password: '',
            });
        }
        return this.generateTokens(user);
    }
    async refreshTokens(userId, refreshToken) {
        const storedToken = await this.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
        });
        if (!storedToken || storedToken.userId !== userId || storedToken.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });
        const user = await this.usersService.findById(userId);
        return this.generateTokens(user);
    }
    async logout(userId, refreshToken) {
        await this.prisma.refreshToken.deleteMany({
            where: { token: refreshToken, userId },
        });
        return { success: true };
    }
    async generateTokens(user) {
        const userId = user.id;
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({ sub: userId }, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_EXPIRES_IN'),
            }),
            this.jwtService.signAsync({ sub: userId }, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
            }),
        ]);
        const decodedRefresh = this.jwtService.decode(refreshToken);
        await this.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId,
                expiresAt: new Date(decodedRefresh.exp * 1000),
            },
        });
        const { password, ...safeUser } = user;
        return {
            user: safeUser,
            accessToken,
            refreshToken,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        mail_service_1.MailService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map