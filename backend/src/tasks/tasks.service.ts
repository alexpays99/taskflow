import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task, Priority } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksQueryDto } from './dto/tasks-query.dto';

export interface PaginatedTasks {
  data: Task[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, query: TasksQueryDto): Promise<PaginatedTasks> {
    const { page = 1, limit = 10, priority, isCompleted, search } = query;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(priority && { priority }),
      ...(isCompleted !== undefined && { isCompleted }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return task;
  }

  async create(userId: string, dto: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateTaskDto): Promise<Task> {
    await this.findOne(id, userId); // Check ownership

    return this.prisma.task.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId); // Check ownership

    await this.prisma.task.delete({
      where: { id },
    });
  }

  async complete(id: string, userId: string): Promise<Task> {
    await this.findOne(id, userId); // Check ownership

    return this.prisma.task.update({
      where: { id },
      data: { isCompleted: true },
    });
  }
}
