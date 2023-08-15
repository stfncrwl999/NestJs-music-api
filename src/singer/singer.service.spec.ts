import { Test, TestingModule } from '@nestjs/testing';
import { SingerService } from './singer.service';

describe('SingerService', () => {
  let service: SingerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SingerService],
    }).compile();

    service = module.get<SingerService>(SingerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
