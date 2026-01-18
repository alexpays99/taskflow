import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TasksQueryDto } from "./dto/tasks-query.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TasksService } from "./tasks.service";

@ApiTags("Tasks")
@Controller("tasks")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("JWT-auth")
class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: "Get all tasks with pagination and filters" })
  @ApiResponse({ status: 200, description: "Returns paginated tasks" })
  async findAll(
    @CurrentUser("sub") userId: string,
    @Query() query: TasksQueryDto,
  ) {
    return this.tasksService.findAll(userId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single task" })
  @ApiParam({ name: "id", description: "Task ID" })
  @ApiResponse({ status: 200, description: "Returns the task" })
  @ApiResponse({ status: 404, description: "Task not found" })
  async findOne(@Param("id") id: string, @CurrentUser("sub") userId: string) {
    return this.tasksService.findOne(id, userId);
  }

  @Post()
  @ApiOperation({ summary: "Create a new task" })
  @ApiResponse({ status: 201, description: "Task created" })
  async create(@CurrentUser("sub") userId: string, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(userId, dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a task" })
  @ApiParam({ name: "id", description: "Task ID" })
  @ApiResponse({ status: 200, description: "Task updated" })
  @ApiResponse({ status: 404, description: "Task not found" })
  async update(
    @Param("id") id: string,
    @CurrentUser("sub") userId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, userId, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a task" })
  @ApiParam({ name: "id", description: "Task ID" })
  @ApiResponse({ status: 204, description: "Task deleted" })
  @ApiResponse({ status: 404, description: "Task not found" })
  async delete(@Param("id") id: string, @CurrentUser("sub") userId: string) {
    return this.tasksService.delete(id, userId);
  }

  @Patch(":id/complete")
  @ApiOperation({ summary: "Mark task as completed" })
  @ApiParam({ name: "id", description: "Task ID" })
  @ApiResponse({ status: 200, description: "Task marked as completed" })
  @ApiResponse({ status: 404, description: "Task not found" })
  async complete(@Param("id") id: string, @CurrentUser("sub") userId: string) {
    return this.tasksService.complete(id, userId);
  }
}

export { TasksController };
