import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query, Res } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto'

@Controller('coffees')
export class CoffeesController {
  constructor(
    // private will automate declare & initialize in the same location
    // readonly only read without change the real class
    private readonly coffeesService: CoffeesService
  ) {}

  @Get() // coffees?limit=10&offset=20
  async findAll(@Query() paginationQueryDto: PaginationQueryDto ) {
    return this.coffeesService.findAll(paginationQueryDto)
  }

  @Get(':id') // coffees/123
  async findOne (
    @Param('id') id: string
  ) {
    return this.coffeesService.findOne(id)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create (
    @Body() createCoffeeDto: CreateCoffeeDto
  ) {
    this.coffeesService.create(createCoffeeDto)
    return createCoffeeDto
  }

  @Patch(':id')
  async update (
    @Param('id') id: string,  @Body() updateCoffeeDto: UpdateCoffeeDto
  ) {
    return this.coffeesService.update(id, updateCoffeeDto)
  }

  @Delete (':id')
  async remove (
    @Param('id') id: string,  @Body() body
  ) {
    return this.coffeesService.delete(id)
  }
}
