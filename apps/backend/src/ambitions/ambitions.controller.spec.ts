import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { Session } from '@ambitiousyou/shared/types';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { AmbitionsController } from './ambitions.controller';
import { AmbitionsService } from './ambitions.service';

jest.mock('src/db');

const TEST_USER_ID = 'user-1';

function buildTestSession(userId: string = TEST_USER_ID): Session {
  return {
    id: 'session-1',
    userId,
    token: 'test-token',
    expiresAt: new Date(Date.now() + 86_400_000),
    ipAddress: null,
    userAgent: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/** Mirrors SessionGuard attachment shape: `request.user` + full `request.session` row. */
function attachSessionFromGuard(context: ExecutionContext, userId: string = TEST_USER_ID): boolean {
  const req = context.switchToHttp().getRequest();
  const session = buildTestSession(userId);
  req['user'] = { id: session.userId };
  req['session'] = session;
  return true;
}

describe('AmbitionsController', () => {
  let controller: AmbitionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AmbitionsController],
      providers: [AmbitionsService],
    }).compile();

    controller = module.get<AmbitionsController>(AmbitionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

describe('AmbitionsController routes', () => {
  const ambitionId = 'amb-123';
  const mockAmbitionsService: jest.Mocked<
    Pick<
      AmbitionsService,
      | 'createAmbition'
      | 'findAllAmbitionsByUserId'
      | 'findMovesBatch'
      | 'findAmbitionFullByUserIdAndId'
      | 'findAmbitionDetailsByUserIdAndId'
      | 'findOneAmbitionById'
      | 'toggleFavourite'
      | 'updateAmbitionById'
      | 'removeAmbitionById'
    >
  > = {
    createAmbition: jest.fn(),
    findAllAmbitionsByUserId: jest.fn(),
    findMovesBatch: jest.fn(),
    findAmbitionFullByUserIdAndId: jest.fn(),
    findAmbitionDetailsByUserIdAndId: jest.fn(),
    findOneAmbitionById: jest.fn(),
    toggleFavourite: jest.fn(),
    updateAmbitionById: jest.fn(),
    removeAmbitionById: jest.fn(),
  };

  let app: INestApplication;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AmbitionsController],
      providers: [{ provide: AmbitionsService, useValue: mockAmbitionsService }],
    })
      .overrideGuard(SessionGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => attachSessionFromGuard(context),
      })
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('routes GET /ambitions/moves to the batch handler, not :ambitionId', async () => {
    mockAmbitionsService.findMovesBatch.mockResolvedValue({ tasks: [], milestones: [] });

    await request(app.getHttpServer()).get('/ambitions/moves').expect(200);

    expect(mockAmbitionsService.findMovesBatch).toHaveBeenCalledWith(TEST_USER_ID, false);
    expect(mockAmbitionsService.findOneAmbitionById).not.toHaveBeenCalled();
  });

  it('routes GET /ambitions/:id/full to the composite handler, not :ambitionId', async () => {
    mockAmbitionsService.findAmbitionFullByUserIdAndId.mockResolvedValue({
      ambition: { id: ambitionId },
      tasks: [],
      milestones: [],
      notes: [],
    });

    await request(app.getHttpServer()).get(`/ambitions/${ambitionId}/full`).expect(200);

    expect(mockAmbitionsService.findAmbitionFullByUserIdAndId).toHaveBeenCalledWith(TEST_USER_ID, ambitionId);
    expect(mockAmbitionsService.findOneAmbitionById).not.toHaveBeenCalled();
  });

  it('routes GET /ambitions/:id/details to the details handler, not :ambitionId', async () => {
    mockAmbitionsService.findAmbitionDetailsByUserIdAndId.mockResolvedValue({ id: ambitionId });

    await request(app.getHttpServer()).get(`/ambitions/${ambitionId}/details`).expect(200);

    expect(mockAmbitionsService.findAmbitionDetailsByUserIdAndId).toHaveBeenCalledWith(TEST_USER_ID, ambitionId);
    expect(mockAmbitionsService.findOneAmbitionById).not.toHaveBeenCalled();
  });

  it('routes PATCH /ambitions/:id/favourite to toggleFavourite, not updateAmbitionById', async () => {
    mockAmbitionsService.toggleFavourite.mockResolvedValue({ id: ambitionId, isFavourited: true });

    await request(app.getHttpServer()).patch(`/ambitions/${ambitionId}/favourite`).expect(200);

    expect(mockAmbitionsService.toggleFavourite).toHaveBeenCalledWith(TEST_USER_ID, ambitionId);
    expect(mockAmbitionsService.updateAmbitionById).not.toHaveBeenCalled();
  });
});
