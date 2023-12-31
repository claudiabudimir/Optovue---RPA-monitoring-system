import { Inject, Injectable } from '@nestjs/common';
import { SESSION_REPOSITORY } from 'src/constants';
import { Session } from './session.entity';

@Injectable()
export class SessionService {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private sessionRepository: typeof Session,
  ) {}
  async findAll(): Promise<Session[]> {
    return await this.sessionRepository.findAll<Session>({
      attributes: ['sessionid'],
    });
  }

  async findSessionsByProcessId(processIdParam: string): Promise<Session[]> {
    const sessions = await this.sessionRepository.findAll<Session>({
      attributes: [
        'sessionid',
        'processid',
        'sessionnumber',
        'startdatetime',
        'starttimezoneoffset',
        'enddatetime',
      ],
      where: {
        processid: processIdParam,
      },
      order: [['startdatetime', 'DESC']],
    });
    return sessions;
  }

  async getMostRecentSession(processIdParam: string): Promise<any> {
    const sessions = await this.findSessionsByProcessId(processIdParam);
    return {
      sessionid: sessions[0].sessionid,
      processid: sessions[0].processid,
      sessionnumber: sessions[0].sessionnumber,
      startdatetime: sessions[0].startdatetime,
      starttimezoneoffset: sessions[0].starttimezoneoffset,
      enddatetime: sessions[0].enddatetime,
    };
  }
}
