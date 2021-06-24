import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';

// ! just add modules in here, not controllers & providers
// ! to keep the instance not twice & prevent us from unexpected issue

/*
 DTO => interface, input, output
*/
@Module({
  imports: [CoffeesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
