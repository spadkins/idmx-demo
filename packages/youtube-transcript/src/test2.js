
// import { YoutubeTranscript } from "youtube-transcript";
import { YoutubeTranscript } from "../dist/index.js";
// const YoutubeTranscript = require("youtube-transcript");

export const generateTranscriptFromURL = async (videoURL) => {
    const transcript = await YoutubeTranscript.fetchTranscript(videoURL);

    return transcript;
  };

generateTranscriptFromURL("https://www.youtube.com/watch?v=9bZkp7q19f0").then((transcript) => {
    console.log(transcript);
  });