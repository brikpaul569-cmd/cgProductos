# Deuda técnica: persistencia de órdenes de ePayco

> Estado: **pendiente, acordado con el usuario.** Se decidió posponer hasta
> validar el flujo de pago de punta a punta. Esa validación ya se logró
> (transacción real `387665504` procesada por el webhook), así que esta deuda
> ya puede abordarse.

## Por qué existe este problema

La tienda no tiene base de datos. El webhook de ePayco valida la firma y
registra la transacción en los logs de Vercel, pero no la guarda en ningún
lugar durable.

Los logs de Vercel rotan en unos días. Consecuencia directa: **cada venta que
pasa por efectivo o un medio de pago diferido se pierde en silencio.**

## El escenario que motiva esta deuda

1. El cliente paga en efectivo vía SafetyPay / Western Union.
2. ePayco genera un código y lo envía por correo. El cliente lo recibe.
3. La orden queda en estado `Pendiente` durante hasta 96 horas.
4. Western Union confirma el cobro horas o días después.
5. Si el cliente cierra la pestaña, o si nadie guarda el código, no queda
   registro de la venta en ningún lado consultable.

En ese estado, si el cliente vuelve al mes reclamando, no hay forma de
encontrar la transacción desde el proyecto: solo queda el log de Vercel, que
puede ya haber rotado.

## Decisión tomada

Se evaluaron tres opciones:

| Opción | Descripción | Decisión |
| --- | --- | --- |
| A | Sin persistencia; solo pantalla honesta y webhook por correo | **Descartada** |
| B | Upstash Redis vía Marketplace de Vercel | **Descartada** |
| C | Google Sheets como almacenamiento de órdenes | **Elegida, pendiente** |

Motivos de la decisión:

- **B quedó descartada** porque requiere registrar una tarjeta de crédito en
  Vercel para aprovisionar el store. Para el volumen actual no se justifica.
- **C se eligió** porque es gratuita, no requiere tarjeta, y es consultable
  desde el celular. Para el volumen esperado es suficiente. Cuando las ventas
  superen el uso razonable de una planilla, se migra a una base de datos real.

## Qué hay que implementar

Registrar cada webhook firmado en una fila de una hoja de Google, con al menos:

- Fecha y hora de recepción
- `ref` de ePayco (`x_ref_payco`)
- ID de transacción (`x_transaction_id`)
- Estado (`x_response`)
- Monto y moneda
- Código de pago del cliente, si viene

La escritura debe ocurrir **solo después** de que la firma haya sido validada.
Una fila escrita antes de validar la firma permitiría que cualquiera fabricara
órdenes en la planilla.

## Requisito previo

Requiere una cuenta de servicio de Google Cloud con acceso de escritura a la
hoja. Pasos pendientes de documentar cuando se aborde la deuda:

1. Crear el proyecto en Google Cloud.
2. Habilitar la Google Sheets API.
3. Crear una cuenta de servicio y descargar su clave JSON.
4. Compartir la hoja con el correo de la cuenta de servicio.
5. Configurar las variables de entorno correspondientes en Vercel.

## Nota sobre la pantalla de cierre

`src/app/response/PaymentOutcomePage.tsx` **no promete** conservar el registro
de la transacción cuando el estado es pendiente. Ese texto se eliminó
deliberadamente porque era falso sin persistencia. Cuando esta deuda se
resuelva, el texto puede actualizarse para volver a ofrecer esa garantía.
