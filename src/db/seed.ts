import dayjs from 'dayjs'
import { client, db } from '.'
import { goalCompletions, goals } from './schema'

async function seed() {
  await db.delete(goalCompletions)
  await db.delete(goals)

  const result = await db
    .insert(goals)
    .values([
      { title: 'Learn Drizzle ORM', desiredWeeklyFrequency: 2 },
      { title: 'Build a fullstack app', desiredWeeklyFrequency: 5 },
      { title: 'Deploy to Vercel', desiredWeeklyFrequency: 1 },
    ])
    .returning({ id: goals.id })

  const startOfWeek = dayjs().startOf('week')

  await db.insert(goalCompletions).values([
    { goalId: result[0].id, createdAt: startOfWeek.toDate() },
    {
      goalId: result[1].id,
      createdAt: startOfWeek.add(1, 'day').toDate(),
    },
    { goalId: result[2].id, createdAt: startOfWeek.add(3, 'day').toDate() },
  ])
}

seed().finally(() => client.end())
