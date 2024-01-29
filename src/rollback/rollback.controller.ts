import { Controller, Get, Delete, UseGuards, Param } from '@nestjs/common';

// services
import { RollbackService } from './rollback.service';

// guards
import { AuthGuard } from '../auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('rollback')
export class RollbackController {
  constructor(private readonly rollbackService: RollbackService) {}

  @Get()
  async findAll() {
    return this.rollbackService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.rollbackService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.rollbackService.delete(id);
  }
}
