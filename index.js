import { Agent, run } from "@openai/agents";// Agent is a class , (A is capital)
import 
const helloAgent = new Agent({
    name: "hello agent", // givin name to the agent
    instructions: `You are an agent that always says hello world`,

}); // initialising a new agent

// run - function to run the agent 
run(helloAgent, 'hey my name is Vivek Kumar') // run returns a promise either put in async or we can use .then
.then((result) => {
    console.log(result.finalOutput);
})


