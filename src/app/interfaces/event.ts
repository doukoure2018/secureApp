import { EventType } from '../enum/event-type.enum';

export interface Events {
  id: Number;
  eventType: EventType;
  description: string;
  device: string;
  ipAddress: string;
  createdAt: Date;
}
