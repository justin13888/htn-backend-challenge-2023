import { PrismaClient, Skill } from '@prisma/client'
import fastify, { type FastifyInstance, type FastifyServerOptions } from 'fastify'
import cors from '@fastify/cors'

// import fastify, { FastifyInstance } from 'fastify';
// import swagger from '@fastify/swagger';
// import swaggerUI from '@fastify/swagger-ui';

interface IUser {
  name: string
  company: string
  email: string
  phone: string
  skills: Array<{
    skill: string
    rating: number
  }>
}

interface IUserUpdateData {
  name?: string
  company?: string
  email?: string
  phone?: string
  skills?: Array<{
    skill: string
    rating: number
  }>
}

interface IGetSkillsQuery {
  min_frequency?: string
  max_frequency?: string
}

interface ISkill {
  name: string
  frequency: number
}

interface IPostByIdParam {
  id: number
}

function build (opts: FastifyServerOptions = {}): FastifyInstance {
  const prisma = new PrismaClient()
  const app = fastify(opts)

  void app.register(cors, {
    origin: true
  })

  // All Users Endpoint
  app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany({
      include: {
        skills: true
      }
    })
    const result = users.map((user) => {
      const userSkills = user.skills.map((skill) => ({
        skill: skill.skill,
        rating: skill.rating
      }))
      return {
        name: user.name,
        company: user.company,
        email: user.email,
        phone: user.phone,
        skills: userSkills
      }
    })
    return result
  })

  // User Information Endpoint
  app.get<{
    Params: IPostByIdParam
  }>('/users/:id', async (req, res) => {
    const { id } = req.params
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        skills: true
      }
    })
    if (user == null) {
      return await res.status(404).send('User not found')
    }
    const userSkills = user.skills.map((skill) => ({
      skill: skill.skill,
      rating: skill.rating
    }))
    const result: IUser = {
      name: user.name,
      company: user.company,
      email: user.email,
      phone: user.phone,
      skills: userSkills
    }
    return result
  })

  // Update User Endpoint
  app.put<{
    Params: IPostByIdParam
    Body: IUserUpdateData
  }>('/users/:id', async (req, res) => {
    const { id } = req.params
    const { name, company, email, phone, skills } = req.body

    let user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { skills: true }
    })

    if (user == null) {
      return await res.status(404).send('User not found')
    }

    user = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name,
        company,
        email,
        phone
      },
      include: {
        skills: true
      }
    })

    if (skills != null) {
      for (const skill of skills) {
        if (user == null) {
          return await res.status(404).send('User not found')
        }
        const existingSkill: Skill | undefined = user.skills.find((s) => s.skill === skill.skill)
        let updatedSkill
        if (existingSkill == null) {
          updatedSkill = {
            create: {
              skill: skill.skill,
              rating: skill.rating
            }
          }
        } else {
          updatedSkill = {
            upsert: {
              where: { id: existingSkill.id },
              update: { rating: skill.rating },
              create: {
                skill: skill.skill,
                rating: skill.rating
              }
            }
          }
        }
        user = await prisma.user.update({
          where: { id: Number(id) },
          data: { skills: updatedSkill },
          include: { skills: true }
        })
      }
    }
    const userSkills = user.skills.map((skill) => ({
      skill: skill.skill,
      rating: skill.rating
    }))
    const result: IUser = {
      name: user.name,
      company: user.company,
      email: user.email,
      phone: user.phone,
      skills: userSkills
    }

    return result
  })

  // Skills Endpoint
  app.get<{ Querystring: IGetSkillsQuery }>('/skills', async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { min_frequency, max_frequency } = req.query
    const skills = await prisma.skill.groupBy({
      by: ['skill'],
      _count: {
        skill: true
      }
    })
    const result: ISkill[] = skills
      .filter((skill) => {
        const count = skill._count.skill
        return (!min_frequency || count >= parseInt(min_frequency)) &&
               (!max_frequency || count <= parseInt(max_frequency))
      })
      .map((skill) => ({
        name: skill.skill,
        frequency: skill._count.skill
      }))
    return result
  })

  return app
}

export default build
