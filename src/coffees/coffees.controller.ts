import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query, SetMetadata, UsePipes, ValidationPipe } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto'
import { ApiTags } from '@nestjs/swagger'


@ApiTags('coffees') // for swagger name
@Controller('coffees')
export class CoffeesController {
  constructor(
    // private will automate declare & initialize in the same location
    // readonly only read without change the real class
    private readonly coffeesService: CoffeesService
  ) {}


  @Public() // set value and check in guards to make this path  public
  @Get() // coffees?limit=10&offset=20
  async findAll(@Query() paginationQueryDto: PaginationQueryDto ) {
    return this.coffeesService.findAll(paginationQueryDto)
  }

  @Get(':id') // coffees/123
  async findOne (
    @Param('id', ParseIntPipe) id: number // ParseIntPipe -> custom pipes to convert string to number
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
