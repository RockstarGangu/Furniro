import { config } from 'dotenv';
import { Hono } from 'hono'
import {cors} from 'hono/cors'

export type Env = {
  NEON_URL: string;
  HI: string;
}

config({ path: '.env' });

const app = new Hono<{ Bindings: Env }>()

app.use('/api/v1/*', cors())

app.get('/', (c) => {
  console.log(c.env.HI)
  return c.text('Hello')
})

export default app
