import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    email: string;
    password: string;
    name?: string;
  }): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  async getProfile(userId: string): Promise<Omit<User, 'password' | 'refreshToken'>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, refreshToken, ...result } = user;
    return result;
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<Omit<User, 'password' | 'refreshToken'>> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });

    const { password, refreshToken, ...result } = user;
    return result;
  }

  async updateAvatar(
    userId: string,
    avatarUrl: string,
  ): Promise<Omit<User, 'password' | 'refreshToken'>> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });

    const { password, refreshToken, ...result } = user;
    return result;
  }

  async deleteAvatar(
    userId: string,
  ): Promise<Omit<User, 'password' | 'refreshToken'>> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: null },
    });

    const { password, refreshToken, ...result } = user;
    return result;
  }
}
