
import 'dotenv/config';
import * as fs from 'fs';

// import dotenv from 'dotenv';
// import dotenvExpand from 'dotenv-expand';
// let parsedDotEnv = dotenv.config();
// console.log("env", process.env);

// BASED ON THE EXAMPLE:
// https://js.langchain.com/docs/modules/chains/popular/vector_db_qa


// import 'commander';
import { OpenAI } from "langchain/llms/openai";
// import { ChatOpenAI } from "langchain/chat_models/openai";
// import { HumanMessage, SystemMessage } from "langchain/schema";
// import { PromptTemplate } from "langchain/prompts";
import { TextLoader } from "langchain/document_loaders/fs/text";
// import { Document } from "langchain/document";
import { YoutubeLoader } from "langchain/document_loaders/web/youtube";

import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "langchain/schema/runnable";
import { Document } from "langchain/document";
import { StringOutputParser } from "langchain/schema/output_parser";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";

// import { initializeAgentExecutorWithOptions } from "langchain/agents";
// import { SerpAPI } from "langchain/tools";
// import { Calculator } from "langchain/tools/calculator";

// process.exit(0);

class Main {
  async run () {
    // const langchainOpenAIconf = {
    //     // openAIApiKey: process.env.OPENAI_API_KEY,
    //     temperature: 0.0,  // 0.0=no creativity, 1.0=max creativity
    // };
    // let llm = new OpenAI(langchainOpenAIconf);

    // const doc = new Document({ pageContent: "foo", metadata: { source: "code" } });
    // console.log("doc", doc);

    // const loader = new TextLoader(path);
    // const docs = await loader.load();
    // console.log("docs.length", docs.length);

    // from langchain.chains.question_answering import load_qa_chain
    // qa_chain = load_qa_chain(llm, chain_type="map_reduce")
    // qa_document_chain = AnalyzeDocumentChain(combine_docs_chain=qa_chain)
    // qa_document_chain.run(input_document=state_of_the_union, question="what did the president say about justice breyer?");


    // let data = fs.readFileSync(path, 'utf8');
    // console.log("data.length", data.length);

    // let prompt = "What are the three most important virtues, expressed in 15 words or less?";
    // console.log(prompt);

    // console.log();
    // let res = await llm.predict(prompt);
    // // console.log("LLM: Response type [%s] length [%s]", typeof(res), typeof(res) === "string" ? res.length : 0);
    // console.log(res);

    // const chatModel = new ChatOpenAI();
    // console.log();
    // res = await chatModel.predict(prompt);
    // // console.log("Chat Model: Response type [%s] length [%s]", typeof(res), typeof(res) === "string" ? res.length : 0);
    // console.log(res);

    // let messages = [ new HumanMessage({ content: prompt }) ];

    // console.log();
    // let msg = await llm.predictMessages(messages);
    // console.log("LLM: Response message");
    // console.log(msg.content);

    // console.log();
    // msg = await chatModel.predictMessages(messages);
    // console.log("Chat Model: Response message");
    // console.log(m  sg.content);

    const model = new ChatOpenAI({});
    let path = "./data/courses/deepwaters205/LTLAO-01-inspiring-vision.transcript.txt";

    const text = fs.readFileSync(path, "utf8");
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 4096 });
    const docs = await textSplitter.createDocuments([text]);

    // https://www.youtube.com/watch?v=fGfiM1F1lTI
    // https://youtu.be/fGfiM1F1lTI
    // const loader = YoutubeLoader.createFromUrl("https://www.youtube.com/watch?v=fGfiM1F1lTI", {
    //   language: "en",
    //   addVideoInfo: true,
    // });
    // const docs = await loader.load();
    // console.log("docs", docs);

    const serializedDocs = (docs: Array<Document>) =>
      docs.map((doc) => doc.pageContent).join("\n\n");

    // Create a vector store from the documents.
    const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
    // Initialize a retriever wrapper around the vector store
    const vectorStoreRetriever = vectorStore.asRetriever();

    // Create a system & human prompt for the chat model
    const SYSTEM_TEMPLATE = `The following is a YouTube transcript of a lesson based on Christian principles.
Each line begins with a timestamp.
The transcript is provided as context to answer the questions that follow.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
----------------
{context}`;

    const messages = [
      SystemMessagePromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
      HumanMessagePromptTemplate.fromTemplate("{question}"),
    ];
    const prompt = ChatPromptTemplate.fromMessages(messages);

    const chain = RunnableSequence.from([
      {
        context: vectorStoreRetriever.pipe(serializedDocs),
        question: new RunnablePassthrough(),
      },
      prompt,
      model,
      new StringOutputParser(),
    ]);

    let answer = await chain.invoke(
      "Outline the main sections of this lesson with between 3 and 6 sections. " +
      "For each section include the timestamp at the beginning of the line. "
    );

    console.log({ answer });

    answer = await chain.invoke(
      "For each of the main sections that you identified, " +
      "enumerate between 3 and 6 of the most important statements of truth in each section. " +
      "For each important statement, include the timestamp at the beginning of the line. "
    );

    console.log({ answer });

    // answer = await chain.invoke(
    //   "To help the listener of the lesson to test their comprehension, " +
    //   "for each of the important points you identified, " +
    //   "produce a multiple choice question with 4 answers, where only 1 is correct. " +
    //   "The correct answer follow each set of questions."
    // );

    // console.log({ answer });

    // answer = await chain.invoke(
    //   "Produce an additional question for the self-test for each Bible verse reference you identified."
    // );

    // console.log({ answer });

    // answer = await chain.invoke(
    //   "Produce a multiple choice self-test quiz so that someone who listens to the lesson can test their comprehension. Each multiple choice question should have 4 answers, where only 1 is correct. Produce a question for each verse reference and a question for each point you identified."
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

