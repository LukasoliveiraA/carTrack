import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { RoutesService } from '../routes.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoutesDriverGateway {
  constructor(private routesService: RoutesService) {}

  @SubscribeMessage('client:new-points')
  async handleMessage(client: any, payload: any) {

    if (!payload || !payload.route_id) {
      console.error('Payload inválido ou não fornecido:', payload);
      return; // Ou envie uma mensagem de erro ao cliente
    }

    const { route_id } = payload;
    console.log('route_id', route_id);
    const route = await this.routesService.findOne(route_id);
    // @ts-expect-error - routes has not been defined
    const { steps } = route.directions.routes[0].legs[0];
    for (const step of steps) {
      const { lat, lng } = step.start_location;
      client.emit(`server:new-points/${route_id}:list`, {
        route_id,
        lat,
        lng,
      });
      console.log(`Evento emitido: server:new-points/list`, { route_id, lat, lng });
      client.broadcast.emit('server:new-points:list', {
        route_id,
        lat,
        lng,
      });
      console.log(`Evento broadcast emitido: server:new-points/list`, { route_id, lat, lng });
      await sleep(2000);
      const { lat: lat2, lng: lng2 } = step.end_location;
      client.emit(`server:new-points/${route_id}:list`, {
        route_id,
        lat: lat2,
        lng: lng2,
      });
      console.log(`Evento emitido: server:new-points/list`, { route_id, lat, lng });
      client.broadcast.emit('server:new-points:list', {
        route_id,
        lat,
        lng,
      });
      console.log(`Evento broadcast emitido: server:new-points/list`, { route_id, lat, lng });
      await sleep(2000);
    }
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


//nest - iniciar pra rota - kafka - golang