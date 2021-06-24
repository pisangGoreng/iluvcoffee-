import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [{
    id: 1,
    name: 'bambang',
    brand: 'bambangku',
    flavors: ['coklat', 'vanilla']
  }]

  findAll() {
    return this.coffees;
  }
  findOne(id: string) {
    // throw => dipakai untuk error yang tidak terduga
    const coffee = this.coffees.find(coffee => coffee.id === +id) // tanda + ??
    if (!coffee) {
      throw new NotFoundException(`Coffee ${id} not foind`)
    }

  }

  create(createCoffeeDto: any) {
    this.coffees.push(createCoffeeDto)
  }

  update(id: string, updateCoffeeDto: any) {
    const existingCoffee = this.findOne(id)
    // if (existingCoffee) {

    // }
  }
  delete(id: string) {
    this.coffees = this.coffees.filter(coffee => coffee.id !== +id)
  }
}
