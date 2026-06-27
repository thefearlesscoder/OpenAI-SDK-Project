import 'dotenv/config';
import { Agent, run, tool } from '@openai/agents';
import { z } from 'zod';

// let sharedHistory = [];

const executeSql = tool({
    name: 'execute_sql',
    description: 'this excutes the sql query',
    parameters: z.object({
        sql: z.string().describe('the sql query'),
    }),
    execute: async function ({ sql }) {
        console.log(`[SQL]: Execute ${sql}`);
        return 'done';
    },
});

const sqlAgent = new Agent({
  name: 'SQL Expert Agent',
  instructions: `
        You are an expert SQL Agent that is specialized in generating SQL queries as per user request.

        Postgres Schema:
    -- users table
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    -- comments table
    CREATE TABLE comments (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      comment_text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
    `,
    tools: [executeSql]
});

// 

async function main(q = '') {
  
  const result = await run(sqlAgent, q, {conversationId: 'conv_6a3eac38e584819689c9ccd2ef40e98d0bd4633429a310cb'});
  
  console.log('Final Out:', result.finalOutput);
}

// TURN 1
main('Update my name as Vivek Kumar and redo the previous query');
