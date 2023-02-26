import { type FastifyServerOptions } from 'fastify'
import request from 'supertest'
import build from '../src/app'

const testConfig: FastifyServerOptions = {
  logger: {
    level: 'info',
    // prettyPrint: true,
    serializers: {
      req: req => ({
        method: req.method,
        url: req.url,
        headers: req.headers
      }),
      res: res => ({
        statusCode: res.statusCode,
        headers: res.getHeaders()
      })
    },
    stream: process.stdout // This line will output logs to stdout
  }
}

describe('Endpoint testing', () => {
  let app: any

  beforeAll(async () => {
    app = build(testConfig)
    // app.listen({ port: 3000 });
    await app.ready()
  })

  afterAll(() => {
    app.close()
  })

  describe('GET /users', () => {
    it('returns all users', async () => {
      const response = await request(app.server).get('/users')

      expect(response.status).toBe(200)
      expect(response.type).toEqual('application/json')
      expect(response.body).toBeDefined()
    })
  })

  describe('GET /users/:id', () => {
    it('returns a user by ID', async () => {
      const response = await request(app.server).get('/users/1')

      expect(response.status).toBe(200)
      expect(response.type).toEqual('application/json')
      expect(response.body).toBeDefined()
      expect(response.body.name).toEqual('Breanna Dillon')
      expect(response.body.company).toEqual('Jackson Ltd')
      expect(response.body.email).toEqual('lorettabrown@example.net')
      expect(response.body.phone).toEqual('+1-924-116-7963')
      expect(response.body.skills).toEqual(
        [
          {
            skill: 'Swift',
            rating: 4
          },
          {
            skill: 'OpenCV',
            rating: 1
          }
        ])
    })

    it('returns 404 if user not found', async () => {
      const response = await request(app.server).get('/users/9999')
      expect(response.status).toBe(404)
      expect(response.text).toBe('User not found')
    })
  })

  describe('PUT /users/:id', () => {
    test("updates a given user's data", async () => {
      const updatedData = {
        name: 'Updated Test User',
        company: 'Updated Test Company',
        email: 'updated.test.user@test.com',
        phone: '555-555-5556',
        skills: [
          { skill: 'JavaScript', rating: 5 },
          { skill: 'TypeScript', rating: 4 },
          { skill: 'Prolog', rating: 4 }
        ]
      }
      const response = await request(app.server)
        .put('/users/123')
        .send(updatedData)

      // TODO: UPDATE
      expect(response.status).toBe(200)
      expect(response.type).toEqual('application/json')
      expect(response.body.name).toEqual('Updated Test User')
      expect(response.body.company).toEqual('Updated Test Company')
      expect(response.body.email).toEqual('updated.test.user@test.com')
      expect(response.body.phone).toEqual('555-555-5556')
      expect(response.body.skills).toEqual(
        [
          {
            skill: 'Prolog',
            rating: 4
          },
          {
            skill: 'Buefy',
            rating: 4
          },
          {
            skill: 'JavaScript',
            rating: 5
          },
          {
            skill: 'TypeScript',
            rating: 4
          }
        ])
    })
    it('returns 404 if user not found', async () => {
      const response = await request(app.server)
        .put('/users/9999')
        .send({ name: 'New name' })
      expect(response.status).toBe(404)
      expect(response.text).toBe('User not found')
    })
  })

  describe('GET /skills', () => {
    test('returns a list of skills with frequency between min and max', async () => {
      const tests: Array<[string, number | undefined, number | undefined]> = [
        ['/skills', undefined, undefined],
        ['/skills?min_frequency=10', 10, undefined],
        ['/skills?max_frequency=20', undefined, 20],
        ['/skills?min_frequency=10&max_frequency=20', 10, 20]
      ]

      for (const [url, min, max] of tests) {
        const response = await request(app.server).get(url)

        expect(response.status).toBe(200)
        expect(response.type).toEqual('application/json')
        expect(response.body).toBeDefined()

        for (const skill of response.body) {
          if (min) {
            expect(skill.frequency).toBeGreaterThanOrEqual(min)
          }
          if (max) {
            expect(skill.frequency).toBeLessThanOrEqual(max)
          }
        }
      }
    })
  })
})
