
// Versions of Node.js
//   20.11.1
// import * as fs from 'fs';
const readlineSync = require('readline-sync');
import { ChatBot, ChatBotSpec } from './classes/ChatBot';

let appOptionDefs = {
  verbose: {
    type: "integer",
    description: "verbose level",
  },
};
let appOptions = {
  verbose: 9,
  args: [],
};
import { ArgvOptionParser } from "./classes/ArgvOptionParser";
new ArgvOptionParser(appOptions, appOptionDefs);
// console.log("appOptions", appOptions);

class Main {
  async run () {
    let verbose = appOptions.verbose || 0;
    if (verbose >= 9) console.log("Starting...");

    let chatBot = new ChatBot();
    let file = appOptions.args.length > 0 ? appOptions.args[0] : "./data/courses/deepwaters205/LTLAO-01-inspiring-vision.transcript.txt";
    let chatBotSpec = await chatBot.loadChatBotSpec(file);
    await chatBot.initialize(chatBotSpec);
    let answer: string = "";

    while (true) {
      let question = readlineSync.question("\nQuestion? ");
      if (question === "exit") {
        break;
      }
      // console.log(`Question:\n${question}`);
      answer = await chatBot.chat(question);
      console.log(`Answer:\n${answer}`);
    }

    // answer = await chatBot.chat("What is the main point of this lesson?");
    // console.log({ answer });
    // answer = await chatBot.chat("Outline the main sections of this lesson with between 3 and 6 sections.");
    // console.log({ answer });
    // answer = await chatBot.chat("For each of the main sections that you identified, " +
    //   "enumerate between 3 and 6 of the most important statements of truth in each section. "
    //   // + "For each important statement, include the timestamp at the beginning of the line. "
    // );
    // console.log({ answer });

    // answer = await chatBot.chat(//   "To help the listener of the lesson to test their comprehension, " +
    //   "for each of the important points you identified, " +
    //   "produce a multiple choice question with 4 answers, where only 1 is correct. " +
    //   "The correct answer follow each set of questions."
    // );

    // console.log({ answer });

    // answer = await chatBot.chat(//   "Produce an additional question for the self-test for each Bible verse reference you identified."
    // );

    // console.log({ answer });

    // answer = await chatBot.chat(//   "Produce a multiple choice self-test quiz so that someone who listens to the lesson can test their comprehension. Each multiple choice question should have 4 answers, where only 1 is correct. Produce a question for each verse reference and a question for each point you identified."
    // );

    // console.log({ answer });
  }
}

let main = new Main();
main.run()
.then(() => {
    // console.log("Done");
})
.catch((err) => {
    console.error("Error", err);
});

