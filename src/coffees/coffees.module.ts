import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity'
import { COFFEE_BRANDS } from './coffees.constant'
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule, // add this to use .env value in this module
    TypeOrmModule.forFeature([Coffee, Flavor, Event])
  ],
  controllers: [CoffeesController],
  providers: [CoffeesService,
    { provide: COFFEE_BRANDS, useFactory: () => ['bambang brand', 'nescafe'] }] // ! custome provider
  ,
  exports: [CoffeesService]
})
export class CoffeesModule {}
