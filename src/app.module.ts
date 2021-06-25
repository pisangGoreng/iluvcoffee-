import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';

// ! just add modules in here, not controllers & providers
// ! to keep the instance not twice & prevent us from unexpected issue

/*
 DTO => interface, input, output
*/
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password:'pass123',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true
    }),
    CoffeesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
