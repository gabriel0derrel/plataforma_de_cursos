import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get('resumo')
  @ApiOperation({ summary: 'Consultar indicadores públicos agregados' })
  resumo() { return this.dashboard.resumo(); }
}
