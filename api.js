
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";


const ai = new GoogleGenAI({ apiKey:process.env.API_KEY});


export async function main(content,path) {
  const myfile = await ai.files.upload({
    file: path,
    config: { mimeType: "image/jpeg" },
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: createUserContent([
      createPartFromUri(myfile.uri, myfile.mimeType),
      content
    ]),
  });
  return response.text;
}




