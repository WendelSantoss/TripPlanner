import { prisma } from "@/lib/prisma";
import z from "zod";
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export const deleteTrip = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().delete(
      '/deleteTrip/:tripId',
      {
        schema: {
          tags: ['trips'],
          summary: 'Delete a trip by ID',
          params: z.object({
            tripId: z.string().uuid(),
          }),
          response: {
            200: z.object({
              message: z.string(),
            }),
            404: z.object({ message: z.string() }).describe('Trip not found'),
          },
        },
      },
      async (request, reply) => {
        const { tripId } = request.params;
        console.log("chamada pra delete...")
        try {
          // Verifica se a trip existe antes de deletar
          const trip = await prisma.trip.findUnique({
            where: { id: tripId },
          });
  
          if (!trip) {
            return reply.status(404).send({
              message: 'Trip not found',
            });
          }
          
          // deletando dados de participantes relacionados a essa trip
          await prisma.participant.deleteMany({
            where: {
              trip_id: tripId,
            },
          });

          // deletando dados de atividades relacionadas a essa trip
          await prisma.activity.deleteMany({
            where: {
              trip_id: tripId,
            },
          });
          
          // deletando dados de links relacionados a essa trip
          await prisma.link.deleteMany({
            where: {
              trip_id: tripId,
            },
          });
          
  
          // Deleta a trip
          await prisma.trip.delete({
            where: { id: tripId },
          });
  
          return reply.status(200).send({
            message: 'Trip deleted successfully',
          });
        } catch (error) {
          console.error(error);
          return reply.status(500).send({
            message: 'An error occurred while deleting the trip',
          });
        }
      }
    );
  };
  