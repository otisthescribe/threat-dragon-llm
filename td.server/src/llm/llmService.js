import OpenAI from 'openai';
import loggerHelper from '../helpers/logger.helper.js';
import env from '../env/Env.js';
import { serverError } from '../controllers/errors.js';
import responseWrapper from '../controllers/responseWrapper.js';

const logger = loggerHelper.get('llm/llmService.js');

const openai = new OpenAI({
    apiKey: env.get().config.OPENAI_API_KEY,
    baseURL: env.get().config.OPENAI_BASE_URL
});

const generateThreatModel = (req, res) => responseWrapper.sendResponseAsync(async () => {
    try {
        let system_context = "Act as an experienced Security Engineer and professional Threat Modeller."
        let user_context = `
        Please generate 5 threats for the component attached at the end.

        Response with an array of JSONs as follows:
        [
            {
                title: "",
                description: "",
                severity: "[Low, Medium or High]",
                mitigation: "[suggest a mitigation here]",
                score: "[integer]"
            },
            { ... },
        ]

        List of hard requirements:
        - DO NOT respond with anything else other than the sturcture above
        - DO NOT add anything else or try to format the output in a different way that is described above
        - Keep in mind the existing threats if there are any. They will be described in the components under key "threats"

        Here is the information about the threat modelled component:
        `;
        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {role: "system", content: system_context},
                {role: "user", content: user_context + req.body.component_data},
            ],
        });
        let data = JSON.parse(chatCompletion.choices[0].message.content);;
        return data;
    } catch (e) {
        logger.error(e);
        return '';
    }
}, req, res, logger);

export default {
  generateThreatModel
};