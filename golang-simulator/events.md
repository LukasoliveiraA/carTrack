#Events

## vamos receber evento
RouteCreated
- id
- distance
- directions
- -  lat
- - lng
### Efeito colateral (Calcular o frete e retornar o evento)

FreightCalculated
- route_id
- amount

---

## vamos receber
DeliveryStarted
- route_id
### refeito colateral

DriverMoved
- route_id
- lat
- lng