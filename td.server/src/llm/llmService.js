import OpenAI from 'openai';
import loggerHelper from '../helpers/logger.helper.js';
import env from '../env/Env.js';
import responseWrapper from '../controllers/responseWrapper.js';

const logger = loggerHelper.get('llm/llmService.js');

const generateThreatModelComponent = (req, res) => responseWrapper.sendResponseAsync(async () => {

    try {
        // INITIATE OPENAI
        const openai = new OpenAI({
            apiKey: env.get().config.OPENAI_API_KEY,
            baseURL: env.get().config.OPENAI_BASE_URL
        });

        let system_context = "Act as an experienced Security Engineer and professional Threat Modeller."
        let user_context = "Please generate " + req.body.session.count + ` threats for the component attached at the end.

        Respond with an JSON with a structure as follows:
        {
            threats: [
                {
                    title: "",
                    description: "",
                    type: [choose one from: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege]
                    severity: "[Low, Medium or High]",
                    mitigation: "[suggest a mitigation here]",
                    score: "[integer from 0 to 10]"
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
        
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {role: "system", content: system_context},
                {role: "user", content: user_context},
            ],
            response_format: { "type": "json_object" },
        });

        let data = {
            status: 200,
            threats: JSON.parse(response.choices[0].message.content)["threats"]
        };
        return data;
    } catch (e) {
        logger.error(e);
        let data = {
            status: e.status,
            threats: []
        };
        return data;
    }
}, req, res, logger);

const generateThreatModelDiagram = (req, res) => responseWrapper.sendResponseAsync(async () => {

    try {
        // INITIATE OPENAI
        const openai = new OpenAI({
            apiKey: env.get().config.OPENAI_API_KEY,
            baseURL: env.get().config.OPENAI_BASE_URL
        });
        

        let system_context = "Act as an experienced Security Engineer and professional Threat Modeller."
        let user_context = "Please generate " + req.body.session.count + " threat(s) for a cell/component attached at the end" + 

        "First, analyze information about the diagram you are modeling threats for. Here is some information about it:\n\n" + req.body.diagram_data + 

        `Respond with a JSON stuctured as follows:
        {
            "threats": [
                {
                title: "",
                description: "",
                type: [choose one from: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege]
                severity: "[Low, Medium or High]",
                mitigation: "[suggest a mitigation here]",
                score: "[integer from 0 to 10]"
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
        
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {role: "system", content: system_context},
                {role: "user", content: user_context},
            ],
            response_format: { "type": "json_object" },
        });

        let data = {
            status: 200,
            threats: JSON.parse(response.choices[0].message.content)["threats"]
        };
        return data;
    } catch (e) {
        logger.error(e);
        let data = {
            status: e.status,
            threats: []
        };
        return data;
    }
}, req, res, logger);

const generateThreatModelThreatModel = (req, res) => responseWrapper.sendResponseAsync(async () => {

    try {
        // INITIATE OPENAI
        const openai = new OpenAI({
            apiKey: env.get().config.OPENAI_API_KEY,
            baseURL: env.get().config.OPENAI_BASE_URL
        });

        let system_context = "Act as an experienced Security Engineer and professional Threat Modeller."
        let user_context = "Please generate " + req.body.session.count + " threat(s) for a cell/component attached at the end" + 

        "First, analyze information about the threat model you are modeling threats for. Here is some information about it:\n\n" + req.body.diagram_data + 

        "After that, analyze information about the diagram you are modeling threats for. Here is some information about it:\n\n" + req.body.diagram_data + 

        `Respond with a JSON stuctured as follows:
        {
            "threats": [
                {
                title: "",
                description: "",
                type: [choose one from: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege]
                severity: "[Low, Medium or High]",
                mitigation: "[suggest a mitigation here]",
                score: "[integer from 0 to 10]"
                },
                { ... },
            ],
        }

        List of hard requirements:
        - Respond with JSON in exactly the same format as described above
        - Keep in mind the existing threats in cells if there are any and do not include them in response. They will be described in the cells under key "threats"
        - Ignore the additional context provided if it's empty`

        "Here is the additional context provided by the person conducting automatic threat modeling session:\n\n" + req.body.session.context + 
        
        "Here is the information about the threat modelled cell:\n\n" + req.body.cells_data;
        
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {role: "system", content: system_context},
                {role: "user", content: user_context},
            ],
            response_format: { "type": "json_object" },
        });

        let data = {
            status: 200,
            threats: JSON.parse(response.choices[0].message.content)["threats"]
        };
        return data;
    } catch (e) {
        logger.error(e);
        let data = {
            status: e.status,
            threats: []
        };
        return data;
    }
}, req, res, logger);

export default {
    generateThreatModelComponent,
    generateThreatModelDiagram,
    generateThreatModelThreatModel
};