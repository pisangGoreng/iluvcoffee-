import { Injectable, HttpException, HttpStatus, NotFoundException, Query, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';
import { Connection, Repository } from 'typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { COFFEE_BRANDS } from './coffees.constant'
import { ConfigService } from '@nestjs/config';
@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [{
    id: 1,
    name: 'bambang',
    recommendations: 0,
    brand: 'bambangku',
    flavors: []
  }]

  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly connection: Connection, // for transaction
    @Inject(COFFEE_BRANDS) coffeeBrands: string[], // inject custom provider to use it, access it without this
    private readonly configService: ConfigService
  ) {
    console.log(coffeeBrands)
    console.log(this.configService.get('database.host')); // access env nested from config
    console.log(this.configService.get('DATABASE_HOST')); // access env


  }

  async findAll(paginationQueryDto: PaginationQueryDto) {
    const { limit, offset } = paginationQueryDto
    return this.coffeeRepository.find({
      relations: ['flavors'],
      skip: offset,
      take: limit
    });
  }
  async findOne(id: number) {
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

  async delete(id: string) {
    this.coffees = this.coffees.filter(coffee => coffee.id !== +id)
  }

  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      coffee.recommendations++;

      const recommendCoffee = new Event()
      recommendCoffee.name = 'recommend_coffee';
      recommendCoffee.type = 'coffee';
      recommendCoffee.payload = { coffeeId: coffee.id }

      await queryRunner.manager.save(coffee)
      await queryRunner.manager.save(recommendCoffee)

      await queryRunner.commitTransaction()
    } catch (error) {
      await queryRunner.rollbackTransaction()
    } finally {
      await queryRunner.release()
    }
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({name})
    if (existingFlavor) {
      return existingFlavor
    }

    return this.flavorRepository.create({name})
  }
}
