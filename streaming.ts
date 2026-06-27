import 'dotenv/config';
import { Agent, run, tool } from '@openai/agents';

const agent = new Agent({
  name: 'Storyteller',
  instructions:
    'You are a storyteller. You will be given a topic and you will tell a story about it.',
});

async function main(query: string) {
    const result = await run(agent, query, {
  stream: true,
})
result
  .toTextStream({
    compatibleWithNodeStreams: true,
  })
  .pipe(process.stdout);
   
}

main(`Tell me a story about a Cat`);