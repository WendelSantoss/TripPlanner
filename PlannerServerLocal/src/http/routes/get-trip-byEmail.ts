import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'

export async function getListTrips(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/trips', async (request, reply) => {
    
    const { email }= request.query as { email : string }
    
    if(!email){
      return reply.status(400).send({message: "Email é obrigatório para requisição"})
    }
      
    const trip = await prisma.trip.findMany({
      where:{
        participants: {
          some: {
            email: email
          }
        }
      },
      include: {
        participants: true,
      },
    })

    if (trip.length === 0) {
      console.log("cahmada para Trips via Email", email)
      return reply.status(404).send({message: 'Nenhuma trip encontrada para este participante.'})
    }
    console.log("cahmada para Trips via Email", email, trip)
    return { trip }
  })
}
// ajustar o componente para acessar os dados da trip pelo email.