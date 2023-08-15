import { Test, TestingModule } from '@nestjs/testing';
import { SingerAlbumService } from './singer-album.service';

describe('SingerAlbumService', () => {
  let service: SingerAlbumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SingerAlbumService],
    }).compile();

    service = module.get<SingerAlbumService>(SingerAlbumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
