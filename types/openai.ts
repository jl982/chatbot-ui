import { OPENAI_API_TYPE } from '../utils/app/const';

export interface OpenAIModel {
  id: string;
  name: string;
  maxLength: number; // maximum length of a message
  tokenLimit: number;
}

export enum OpenAIModelID {
  GPT_3_5 = 'gpt-3.5-turbo',
  GPT_4_5 = 'gpt-4.5-preview',
  GPT_4_TURBO = 'gpt-4-turbo',
  GPT_4O = 'gpt-4o',
}

// in case the `DEFAULT_MODEL` environment variable is not set or set to an unsupported model
export const fallbackModelID = OpenAIModelID.GPT_3_5;

export const OpenAIModels: Record<OpenAIModelID, OpenAIModel> = {
  [OpenAIModelID.GPT_3_5]: {
    id: OpenAIModelID.GPT_3_5,
    name: OpenAIModelID.GPT_3_5,
    maxLength: 12000,
    tokenLimit: 4000,
  },
  [OpenAIModelID.GPT_4_5]: {
    id: OpenAIModelID.GPT_4_5,
    name: OpenAIModelID.GPT_4_5,
    maxLength: 16384,
    tokenLimit: 128000,
  },
  [OpenAIModelID.GPT_4_TURBO]: {
    id: OpenAIModelID.GPT_4_TURBO,
    name: OpenAIModelID.GPT_4_TURBO,
    maxLength: 380000,
    tokenLimit: 128000,
  },
  [OpenAIModelID.GPT_4O]: {
    id: OpenAIModelID.GPT_4O,
    name: OpenAIModelID.GPT_4O,
    maxLength: 380000,
    tokenLimit: 128000,
  },
};
