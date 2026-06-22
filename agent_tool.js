import { Agent, tool , run} from "@openai/agents";
import 'dotenv/config';
import { z } from "zod";
import axios from "axios";

const getWeatherTool = tool({
    name: 'get_weather',
    description: 'returns the current weather information for the given city',
    parameters: z.object({
        city: z.string().describe('name of the city'),
    }),
    execute: async function ({city}) {
        const url = `https://wttr.in/${city.toLowerCase()}?format=%C+%t`;
        const response = await axios.get(url, { responseType: 'text'})
        return `the weather of ${city} is ${response.data}`;
    } // this fucntion would actually be executed
});

// TODO: complete the sendEmail tool to actually receive the email.

const sendEmailTool = tool({
  name: 'send_email',
  description: 'This tool sends an email',
  parameters: z.object({
    toEmail: z.string().describe('email address to'),
    subject: z.string().describe('subject'),
    body: z.string().describe('body of the email'),
  }),   
  execute: async function ({ body, subject, toEmail }) {},
});

const agent = new Agent({
    name: "Weather Agent",
    instructions: `
    You are an expert weather agent that helps user to tell weather report.
   `,
    tools: [getWeather, sendEmailTool] // array of the tools
})

async function main(query = '') {
    const result = await run(agent, query);
    console.log(`Result : `, result.finalOutput);
}
main(`What is the current weather of Patiala, Lucknow and Delhi`);
// without tool the aget cant know weather of which date it need to find etc.
// based in the quesry the LLM can actua;;y decide which tool to call