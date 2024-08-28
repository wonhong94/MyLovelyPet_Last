import { GoogleGenerativeAI } from "@google/generative-ai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", safetySettings
});

const generationConfig = {
  temperature: 0.2,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// 챗봇 세션과 히스토리를 관리하는 클래스
class ChatBotSession {
  constructor() {
    this.chatSession = null;
    this.history = [
      {
        role: "user",
        parts: [
          { 
            text: "너는 애완용품 판매점의 인공지능 대화 엔진인 멍냥이야. " + 
                  "너가 수용하는 주제는 굉장히 넓고 다양한 질문이 들어올 수 있어. "+
                  "만약에 애완동물의 건강에 관해 물어보면 니가 질문을 해서 질병을 좁히고 해결방안을 자세하게 알려줘. " +
                  "사용자에게 답변,질문할 때는 귀엽게 냥 또는 멍 말투에 이모지 붙여서 답변해줘야해. " + 
                  "'~ 수 있냥', '~ 수 있다멍', ~ '~ 같다냥', '~ 없냐멍', '~ 않냐멍' 이런식으로 이모지 붙여서 답변해. '~니' 금지야. " +
                  "시작할 때는 반갑다냥<cat> 무엇이 궁금하냐멍<dog> 문구에 이모지 넣어서 인사해줘. " + 
                  "답변할 때 한 문장이 끝나면 <br> 처리 해줄래"
          },
        ],
      },
    ];
  }

  async getGeminiResponse(prompt) {
    try {
      // 첫 요청 시에만 세션을 시작
      if (!this.chatSession || prompt === "종료") {
        this.chatSession = model.startChat({
          generationConfig,
          history: this.history,
        });
      }

      // 사용자의 새로운 메시지를 히스토리에 추가
      this.history.push({
        role: "user",
        parts: [{ text: prompt }],
      });

      // 모델에 메시지 전송
      const result = await this.chatSession.sendMessage(prompt);
      let responseText = await result.response.text();

      // 받은 응답을 히스토리에 추가
      this.history.push({
        role: "model",
        parts: [{ text: responseText }],
      });

      // 불필요한 기호나 공백 제거
      responseText = responseText
        .replace(/\n/g, ' ')  // '\n'을 공백으로 대체
        .replace(/<br>/g, '\n')  // '<br>'을 \n으로 대체
        .replace(/<cat>/g, '😸​')  // '<br>'을 \n으로 대체
        .replace(/<dog>/g, '🐶')  // '<br>'을 \n으로 대체
        .replace(/\s+(?=[😸🐶])/g, '') // 이모지 앞 공백 제거
        .replace(/\*/g, '');  // '*'을 제거 

      return responseText;
    } catch (error) {
      console.error("Gemini API 에러:", error);
      throw new Error("챗봇 응답을 생성하는 데 문제가 발생했습니다.");
    }
  }

  // 세션과 히스토리 초기화
  resetSession() {
    this.chatSession = null;
    this.history = [
      {
        role: "user",
        parts: [
          { 
            text: "너는 애완용품 판매점의 인공지능 대화 엔진인 멍냥이야. " + 
                  "너가 수용하는 주제는 굉장히 넓고 다양한 질문이 들어올 수 있어. "+
                  "만약에 애완동물의 건강에 관해 물어보면 니가 질문을 해서 질병을 좁히고 해결방안을 자세하게 알려줘. " +
                  "사용자에게 답변,질문할 때는 귀엽게 냥 또는 멍 말투에 이모지 붙여서 답변해줘야해. " + 
                  "'~ 수 있냥', '~ 수 있다멍', ~ '~ 같다냥', '~ 없냐멍', '~ 않냐멍' 이런식으로 이모지 붙여서 답변해. '~니' 금지야. " +
                  "시작할 때는 반갑다냥 무엇이 궁금하냐멍 문구에 이모지 넣어서 인사해줘. " + 
                  "답변할 때 한 문장이 끝나면 <br> 처리 해줄래"
          }
        ],
      },
    ];
  }
}

// 인스턴스를 사용하여 각 페이지에서 독립적인 세션 관리
export const chatBotSession = new ChatBotSession();
