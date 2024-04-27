import * as fs from "fs";

// BASED ON THE EXAMPLE:
// https://js.langchain.com/docs/modules/chains/popular/vector_db_qa

import { OpenAI } from "langchain/llms/openai";
// import { ChatOpenAI } from "langchain/chat_models/openai";
// import { HumanMessage, SystemMessage } from "langchain/schema";
// import { PromptTemplate } from "langchain/prompts";
import { TextLoader } from "langchain/document_loaders/fs/text";
// import { Document } from "langchain/document";
import { YoutubeLoader } from "langchain/document_loaders/web/youtube";
import { YoutubeTranscript } from 'youtube-transcript';

// console.log("YoutubeTranscript", YoutubeTranscript);
// process.exit(0);

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
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

export interface ChatBotSpec {
  file?:        string;
  verbose?:     number;
}

// interface ChatBotData {
//   sourceTexts?: string[];
// }

export class ChatBot {
  options?: any;
  model?: ChatOpenAI;
  chain?: RunnableSequence;

  // standard constructor
  constructor(options: any = {}) {
    this.options = options;
    if (!this.options.verbose) this.options.verbose = 0;
    if (!fs.existsSync("data")) fs.mkdirSync("data");
  }

  async loadChatBotSpec(file?: string): Promise<ChatBotSpec> {
    return {
      file: file,
      verbose: this.options.verbose,
    };
  }

  async initialize (spec?: ChatBotSpec) {
    if (!spec) {
      spec = {
        verbose: 1
      };
    }
    const verbose = spec.verbose || 0;
    const model = new ChatOpenAI({});
    const file: string = spec.file || "";
    let docs: Document[] = [];

    if (file) {
      console.log("Loading file as context for your questions [%s]", file);
    }
    else {
      console.log("No file specified as context for your questions.");
    }

    let matches: any;
    let text: string = "";
    if (!file) {
      // text = "";
    }
    else if (matches = file.match(/^(https:\/\/www\.youtube\.com\/watch\?v=|https:\/\/youtu\.be\/)([A-Za-z0-9_]{11})/)) {   // https://www.youtube.com/watch?v=fGfiM1F1lTI&t=1065s
      const videoId = matches[2];
      const url = "https://www.youtube.com/watch?v=" + videoId;
      // https://www.youtube.com/watch?v=fGfiM1F1lTI
      // https://youtu.be/fGfiM1F1lTI
      const loader = YoutubeLoader.createFromUrl(url, {
        language: "en",
        addVideoInfo: true,
      });
      docs = await loader.load();
      console.log("docs", docs);

      // try {
      //   const transcript = await YoutubeTranscript.fetchTranscript(url);
      //   text = transcript.map(item => `${item.text}`).join('\n');
      //   // const textWithTimestamps = transcript.map(item => `${item.text} (${item.timestamp})`).join('\n');
      //   // text = textWithTimestamps;
      // }
      // catch (err: any) {
      //   console.log("Error fetching transcript from YouTube for video [%s]", videoId, err);
      // }
    }
    else {
      text = file ? fs.readFileSync(file, "utf8") : "";
    }
    if (text && (!docs || docs.length === 0)) {
      const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 4096 });
      docs = await textSplitter.createDocuments([text]);
    }
    if (verbose >= 9) console.log("docs", docs);

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

    const serializedDocs = (docs: Array<Document>) =>
      docs.map((doc) => doc.pageContent).join("\n\n");

    // Create a vector store from the documents.
    const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
    // Initialize a retriever wrapper around the vector store
    const vectorStoreRetriever = vectorStore.asRetriever();

    // Create a system & human prompt for the chat model
    const SYSTEM_TEMPLATE = `The following is text that you are going to be asked questions about.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
----------------
{context}`;

    const messages = [
      SystemMessagePromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
      HumanMessagePromptTemplate.fromTemplate("{question}"),
    ];
    const prompt = ChatPromptTemplate.fromMessages(messages);

    this.chain = RunnableSequence.from([
      {
        context: vectorStoreRetriever.pipe(serializedDocs),
        question: new RunnablePassthrough(),
      },
      prompt,
      model,
      new StringOutputParser(),
    ]);
  }

  public async chat(question: string): Promise<string> {
    let answer = this.chain ? await this.chain.invoke(question) : "I don't know";
    return(answer);
  }
}
