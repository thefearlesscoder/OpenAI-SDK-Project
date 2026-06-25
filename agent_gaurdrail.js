import 'dotenv/config';
import { Agent, run, tool } from '@openai/agents';


const mathAgent = new Agent({
    name: 'maths agent',
    instructions:`
    You are a maths expert agent. You need to solve the maths related queries of the users 
    `,
})

async function main(q = '') {
    const result = await run(mathAgent, q);
    console.log(result.finalOutput);
    
}

// main(`what is 2 * 2 / 5 + 5`);
main(`how mainy types of tenses are there in english grammer`);