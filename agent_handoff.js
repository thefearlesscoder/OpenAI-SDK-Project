import 'dotenv/config';
import { Agent, run, tool } from '@openai/agents';
import {z} from 'zod';
import fs from 'node:fs/promises';
import { RECOMMENDED_PROMPT_PREFIX } from '@openai/agents-core/extensions';

// divert the call t the refund agent when as for the the refund

//tool
const fetchAvailablePlans = tool({
    name: 'fetch_avaible_plans',
    description:'fetches the available plans for internet',
    parameters: z.object({}),
    execute: async function () {
        return [
      { plan_id: '1', price_inr: 399, speed: '30MB/s' },
      { plan_id: '2', price_inr: 999, speed: '100MB/s' },
      { plan_id: '3', price_inr: 1499, speed: '200MB/s' },
    ]; 
    },
})

//tool
const processRefund = tool({
    name: 'process_refund',
    description: 'this tool processes the refund for a customer',
    parameters: z.object({
        customer_id: z.string().describe('id of the customer'),
        reason: z.string().describe('reason for the refund'),
    }),
    execute: async function ({ customerId, reason }) {
    await fs.appendFile(
      './refunds.txt',
      `Refund for Customer having ID ${customerId} for ${reason}`,
      'utf-8'
    );
    return { refundIssued: true };
  },
})

// refund agent
const refundAgent = new Agent({
    name: 'refund_agent',
    instructions: `
    You are an expert in issueing refunds to the customers
    `,
    tools: [processRefund]
})

// sales agent
const salesAgent = new Agent({
    name: 'sales_agent',
    instructions: `
    You are an expert sales agent for an internet braodband company. Talk to them
    and help them with what they need.
    `,
    tools: [fetchAvailablePlans, refundAgent.asTool({
        toolName: 'refunt_expert',
        toolDescription: 'handles refund questions and request'

    })],
})

const receptionAgent = new Agent({
    name:'reception agent',
    instructions:`
    ${RECOMMENDED_PROMPT_PREFIX}
    you are the customer facing agent expert in understanfing what customer needs
    and then route them or handoff them the right agent.
    `,
    handoffDescription: `You have two agents available
        - salesAgent: Expert in handling queries like all the plans and pricing available.
          Good for new customers.

        - refundAgent: Expert in handing the refund processing, for existing customers.
    `,

    handoffs: [salesAgent, refundAgent],
})


async function main(query = '') {
    const response = await run(receptionAgent, query);

    console.log(`Result `, response.finalOutput);  
    console.log(`history `, response.history);  

}

main(`Hey there, can you tell me what plans are best for me ?`);

main(`i want a refund on my existing plan, facinf speed issues on internet, custID: 443`);