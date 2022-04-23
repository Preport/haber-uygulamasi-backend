import { Test, TestingModule } from '@nestjs/testing';
import { KullaniciService } from './kullanici.service';

describe('KullaniciService', () => {
  let service: KullaniciService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KullaniciService],
    }).compile();

    service = module.get<KullaniciService>(KullaniciService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
