// unsing converation ID to remener the context
import 'dotenv/config';
import { Agent, tool, run } from '@openai/agents';
import {OpenAI} from 'openai';

const client = new OpenAI();

client.conversations.create({}).then(e => {
    console.log( `Conve thread created id = `, e.id);
})