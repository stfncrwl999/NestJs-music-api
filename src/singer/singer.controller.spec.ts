import { Test, TestingModule } from '@nestjs/testing';
import { SingerController } from './singer.controller';
import { SingerService } from './singer.service';

describe('SingerController', () => {
  let controller: SingerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SingerController],
      providers: [SingerService],
    }).compile();

    controller = module.get<SingerController>(SingerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
