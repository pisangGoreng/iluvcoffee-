import { Injectable, HttpException, HttpStatus, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Repository } from 'typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [{
    id: 1,
    name: 'bambang',
    brand: 'bambangku',
    flavors: []
  }]
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>
  ) {}

  async findAll(paginationQueryDto: PaginationQueryDto) {
    const { limit, offset } = paginationQueryDto
    return this.coffeeRepository.find({
      relations: ['flavors'],
      skip: offset,
      take: limit
    });
  }
  async findOne(id: string) {
    console.log("🚀 ~ file: coffees.service.ts ~ line 25 ~ CoffeesService ~ findOne ~ id", id)
    const coffee = this.coffeeRepository.findOne(id, {
      relations: ['flavors']
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee ${id} not foind`)
    }

    return coffee
  }

  async create(createCoffeeDto: any) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
    )

    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors
    })

    return this.coffeeRepository.save(coffee)
  }

  async update(id: string, updateCoffeeDto: any) {
    const flavors = updateCoffeeDto.flavors && (
      await Promise.all(
        updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
      )
    )

    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
      flavors
    })

    if (!coffee) {
      throw new NotFoundException(`Coffee ${id} not found`)
    }

    return this.coffeeRepository.save(coffee)
  }
  delete(id: string) {
    this.coffees = this.coffees.filter(coffee => coffee.id !== +id)
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({name})
    if (existingFlavor) {
      return existingFlavor
    }

    return this.flavorRepository.create({name})
  }
}
