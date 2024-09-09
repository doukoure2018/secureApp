import { EventType } from '@angular/router';

export interface Events {
  id: Number;
  type: EventType;
  description: string;
  device: string;
  ipAddress: string;
  createAt: Date;
}
