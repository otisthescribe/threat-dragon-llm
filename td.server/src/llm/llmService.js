import OpenAI from 'openai';
import loggerHelper from '../helpers/logger.helper.js';
import env from '../env/Env.js';
import responseWrapper from '../controllers/responseWrapper.js';

const logger = loggerHelper.get('llm/llmService.js');

const generateThreatModelComponent = (req, res) => responseWrapper.sendResponseAsync(async () => {

    // INITIATE OPENAI
    const openai = new OpenAI({
        apiKey: env.get().config.OPENAI_API_KEY,
        baseURL: env.get().config.OPENAI_BASE_URL
    });

    try {
        let system_context = "Act as an experienced Security Engineer and professional Threat Modeller."
        let user_context = "Please generate " + req.body.session.count + ` threats for the component attached at the end.

        Response with an JSON with a structure as follows:
        {
            threats: [
                {
                    title: "",
                    description: "",
                    severity: "[Low, Medium or High]",
                    mitigation: "[suggest a mitigation here]",
                    score: "[integer]"
                },
                { ... },
            ]   
        }

        List of hard requirements:
        - DO NOT respond with anything else other than the structure above
        - DO NOT add anything else or try to format the output in a different way that is described above including json formatting, respond only with a valid JSON
        - Keep in mind the existing threats if there are any and skip them. They will be described in the components under key "threats"
        - Ignore the additional context provided if it is empty or "No additional context"

        Here is the additional context provided by the person conducting automatic threat modeling session: ` + req.body.session.context + 
        
        "\n\nHere is the information about the threat modelled component:\n\n" + req.body.component_data;

        console.log(user_context);
        
        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {role: "system", content: system_context},
                {role: "user", content: user_context},
            ],
            response_format: { "type": "json_object" },
        });
        let data = JSON.parse(chatCompletion.choices[0].message.content);;
        console.log(data);
        return data;
    } catch (e) {
        logger.error(e);
        return '';
    }
}, req, res, logger);

const generateThreatModelDiagram = (req, res) => responseWrapper.sendResponseAsync(async () => {

    // INITIATE OPENAI
    const openai = new OpenAI({
        apiKey: env.get().config.OPENAI_API_KEY,
        baseURL: env.get().config.OPENAI_BASE_URL
    });

    try {
        let system_context = "Act as an experienced Security Engineer and professional Threat Modeller."
        let user_context = "Please generate " + req.body.session.count + "threat(s) for a cell/component attached at the end" + 

        "First, analyze information about the diagram you are modeling threats for. Here is some information about it:\n\n" + req.body.diagram_data + 

        `Response with a JSON stuctured as follows:
        {
            "threats": [
                {
                title: "",
                description: "",
                severity: "[Low, Medium or High]",
                mitigation: "[suggest a mitigation here]",
                score: "[integer]"
                },
                { ... },
            ],
        }

        List of hard requirements:
        - DO NOT respond with anything else other than the structure above
        - DO NOT add anything else or try to format the output in a different way that is described above including json formatting, respond only with a valid JSON
        - Keep in mind the existing threats in cells if there are any and do not include them in response. They will be described in the cells under key "threats"
        - Ignore the additional context provided if it is empty or "No additional context"

        Here is the additional context provided by the person conducting automatic threat modeling session: ` + req.body.session.context + 
        "\n\nHere is the information about the threat modelled cell:\n\n" + req.body.cells_data;

        console.log(user_context);
        
        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {role: "system", content: system_context},
                {role: "user", content: user_context},
            ],
            response_format: { "type": "json_object" },
        });
        let data = JSON.parse(chatCompletion.choices[0].message.content);
        console.log(data);
        return data;
    } catch (e) {
        logger.error(e);
        return '';
    }
}, req, res, logger);

export default {
    generateThreatModelComponent,
    generateThreatModelDiagram
};