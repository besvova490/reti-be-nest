import { Injectable } from '@nestjs/common';
import { EntitySubscriberInterface, UpdateEvent, RemoveEvent } from 'typeorm';

// entities
import { Event } from './event.entity';

// services
import { RollbackService } from 'src/rollback/rollback.service';
import * as dayjs from 'dayjs';

@Injectable()
export class EventsSubscriber implements EntitySubscriberInterface<Event> {
  constructor(readonly rollbackService: RollbackService) {}

  listenTo() {
    return Event;
  }

  async afterUpdate(event: UpdateEvent<Event>) {
    const oldValues = [...event.updatedColumns].reduce(
      (prev, current) => ({
        ...prev,
        [current.propertyName]: event.databaseEntity[current.propertyName],
      }),
      {},
    );

    const [draftRevertQuery, parameters] = event.connection
      .createQueryBuilder()
      .update(event.metadata.name)
      .set(oldValues)
      .where('id = :id', { id: event.databaseEntity.id })
      .getQueryAndParameters();

    let revertQuery = draftRevertQuery;

    parameters.forEach((parameter, index) => {
      if (parameter instanceof Date) {
        revertQuery = revertQuery.replace(
          `$${index + 1}`,
          `'${dayjs(parameter).format('YYYY-MM-DD HH:mm:ss')}'`,
        );

        return;
      }

      revertQuery = revertQuery.replace(`$${index + 1}`, `'${parameter}'`);
    });

    console.log(revertQuery);

    this.rollbackService.create({
      query: revertQuery,
      table: event.metadata.name,
      recordId: event.databaseEntity.id,
    });
  }

  afterRemove(event: RemoveEvent<Event>) {
    const [draftRevertQuery, parameters] = event.connection
      .createQueryBuilder()
      .insert()
      .into(event.metadata.name)
      .values({
        ...event.entity,
        guests: event.entity.guests.map((guest) => guest.id),
      })
      .getQueryAndParameters();

    let revertQuery = draftRevertQuery;

    parameters.forEach((parameter, index) => {
      if (parameter instanceof Date) {
        revertQuery = revertQuery.replace(
          `$${index + 1}`,
          `'${dayjs(parameter).format('YYYY-MM-DD HH:mm:ss')}'`,
        );

        return;
      }

      revertQuery = revertQuery.replace(`$${index + 1}`, `'${parameter}'`);
    });

    this.rollbackService.create({
      query: revertQuery,
      table: event.metadata.name,
      recordId: event.databaseEntity.id,
    });

    event.connection.query(revertQuery).then((res) => console.log(res));
  }
}
