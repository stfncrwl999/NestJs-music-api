import { Test, TestingModule } from '@nestjs/testing';
import { SingerAlbumController } from './singer-album.controller';
import { SingerAlbumService } from './singer-album.service';

describe('SingerAlbumController', () => {
  let controller: SingerAlbumController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SingerAlbumController],
      providers: [SingerAlbumService],
    }).compile();

    controller = module.get<SingerAlbumController>(SingerAlbumController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
