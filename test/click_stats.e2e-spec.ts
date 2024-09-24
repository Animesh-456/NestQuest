import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClickStat } from '../src/click_stats/entities/click_stat.entity';
import { AppModule } from '../src/app.module';

describe('ClickStatController (e2e)', () => {
  let app: INestApplication;
  let clickStatRepository: Repository<ClickStat>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    clickStatRepository = moduleFixture.get<Repository<ClickStat>>(
      getRepositoryToken(ClickStat),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/GET click-stats/track/:id', () => {
    it('should increment the click count of the specified stat', async () => {
      const createdClickStat = await clickStatRepository.save({
        campaignId: 2,
        clickCount: 0,
        link: 'https://example.com', 
      });

      // Perform a track request
      const response = await request(app.getHttpServer())
        .get(`/click-stats/track/${createdClickStat.id}`)
        .expect(200);

      expect(response.body.clickCount).toBe(1); 
    });
  });
});
