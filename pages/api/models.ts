import { NextApiRequest, NextApiResponse } from 'next';
import { OPENAI_API_HOST, OPENAI_API_TYPE, OPENAI_API_VERSION, OPENAI_ORGANIZATION } from '@/utils/app/const';
import { OpenAIModel, OpenAIModelID, OpenAIModels } from '@/types/openai';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { key } = req.body as { key: string };

    let url = `${OPENAI_API_HOST}/v1/models`;
    if (OPENAI_API_TYPE === 'azure') {
      url = `${OPENAI_API_HOST}/openai/deployments?api-version=${OPENAI_API_VERSION}`;
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(OPENAI_API_TYPE === 'openai' && {
        Authorization: `Bearer ${key ? key : process.env.OPENAI_API_KEY}`
      }),
      ...(OPENAI_API_TYPE === 'azure' && {
        'api-key': `${key ? key : process.env.OPENAI_API_KEY}`
      }),
      ...((OPENAI_API_TYPE === 'openai' && OPENAI_ORGANIZATION) && {
        'OpenAI-Organization': OPENAI_ORGANIZATION,
      }),
    };

    const response = await fetch(url, { headers });

    if (response.status === 401) {
      return res.status(500).json({ error: 'Unauthorized' });
    } else if (response.status !== 200) {
      console.error(
        `OpenAI API returned an error ${
          response.status
        }: ${await response.text()}`,
      );
      throw new Error('OpenAI API returned an error');
    }

    const json = await response.json();

    const models: OpenAIModel[] = json.data
      .map((model: any) => {
        const model_name = (OPENAI_API_TYPE === 'azure') ? model.model : model.id;
        for (const [key, value] of Object.entries(OpenAIModelID)) {
          if (value === model_name) {
            return {
              id: model.id,
              name: OpenAIModels[value].name,
            };
          }
        }
      })
      .filter(Boolean);

    return res.status(200).json(models);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default handler;