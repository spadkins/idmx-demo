
import { YoutubeTranscript } from './index.js'

let url = "https://www.youtube.com/watch?v=fGfiM1F1lTI";

class Main {
  async run () {
    let transcript = await YoutubeTranscript.fetchTranscript(url);
    console.log(transcript);
  }
}

let main = new Main();
main.run().then(() => { console.log("Done."); });
