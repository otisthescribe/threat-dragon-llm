import { generateThreatsForComponent, generateThreatsForDiagram, generateThreatsForThreatModel } from '../api/threatGenerator.js';
import { createNewTypedThreat } from './index.js'
import { tc } from '../../i18n/index.js';

function translate_to_stride(type) {
    switch (type) {
        case "Spoofing":
            return tc('threats.model.stride.spoofing');
        case "Tampering":
            return tc('threats.model.stride.tampering');
        case "Repudiation":
            return tc('threats.model.stride.repudiation');
        case "Information disclosure":
            return tc('threats.model.stride.informationDisclosure');
        case "Denial of service":
            return tc('threats.model.stride.denialOfService');
        case "Elevation of privilege":
            return tc('threats.model.stride.elevationOfPrivilege');
        default:
            return tc('threats.model.stride.spoofing');
    }
}

export const createNewGeneratedThreatsForComponent = async (diagram, cell, start_number, session) => {
    // DEFINE VARIABLES
    let threats = [];
    let threat;
    let threat_number = start_number;

    // GENERATE THREATS
    let res = await generateThreatsForComponent(JSON.stringify(cell.data), session);
    let gen_threats = res.data.threats;

    // HANDLE RESPONSE
    if (res.data.status == 200) {
        gen_threats.forEach((gen_threat) => {
            // CREATE BLANK THREAT
            threat = createNewTypedThreat(diagram.diagramType, cell.data.type, threat_number);
            // UPDATE THREAT WITH DETAILS RETURNED
            threat.title = gen_threat.title;
            threat.description = gen_threat.description;
            threat.type = translate_to_stride(gen_threat.type);
            threat.severity = gen_threat.severity;
            threat.mitigation = gen_threat.mitigation;
            threat.score = gen_threat.score;
            // ADD TO RESPONSE
            threats.push(threat)
            threat_number = threat_number + 1;
        });
    }

    // RETURN THREATS
    // IN CASE OF ERROR WITH LLM, THREATS WILL BE EMPTY AND STATUS WILL BE 403, 500 etc.
    return {
        threats: threats,
        status: res.data.status
    };
}

export const createNewGeneratedThreatsForDiagram = async (diagram, cell, start_number, session) => {
    // DEFINE VARIABLES
    let diagram_data = {
        title: diagram.title,
        description: diagram.description
    }
    let threat
    let threats = []
    let threat_number = start_number;

    // GENERATE THREATS
    let res = await generateThreatsForDiagram(JSON.stringify(diagram_data), JSON.stringify(cell.data), session);
    let gen_threats = res.data.threats;
    
    // HANDLE RESPONSE
    if (res.status == 200) {
        gen_threats.forEach((gen_threat) => {
            // CREATE BLANK THREAT
            threat = createNewTypedThreat(diagram.diagramType, cell.data.type, threat_number);
            // UPDATE THREAT WITH DETAILS RETURNED
            threat.title = gen_threat.title;
            threat.description = gen_threat.description;
            threat.type = translate_to_stride(gen_threat.type);
            threat.severity = gen_threat.severity;
            threat.mitigation = gen_threat.mitigation;
            threat.score = gen_threat.score;
            // ADD TO RESPONSE
            threats.push(threat)
            threat_number = threat_number + 1;
        });
    }

    // RETURN THREATS
    // IN CASE OF ERROR WITH LLM, THREATS WILL BE EMPTY AND STATUS WILL BE 403, 500 etc.
    return {
        threats: threats,
        status: res.data.status
    };
}

export const createNewGeneratedThreatsForThreatModel = async (threat_model_summary, diagram, cell, start_number, session) => {
    // DEFINE VARIABLES
    let threat_model_data = {
        title: threat_model_summary.title,
        description: threat_model_summary.description
    }
    let diagram_data = {
        title: diagram.title,
        description: diagram.description
    }
    let threat
    let threats = []
    let threat_number = start_number;

    // GENERATE THREATS
    let res = await generateThreatsForThreatModel(threat_model_data, diagram_data, JSON.stringify(cell.data), session);
    let gen_threats = res.data.threats;

    // HANDLE RESPONSE
    if (res.status == 200) {
        gen_threats.forEach((gen_threat) => {
            threat = createNewTypedThreat(diagram.diagramType, cell.type, threat_number);
            // UPDATE THREAT HERE
            threat.title = gen_threat.title;
            threat.description = gen_threat.description;
            threat.type = translate_to_stride(gen_threat.type);
            threat.severity = gen_threat.severity;
            threat.mitigation = gen_threat.mitigation;
            threat.score = gen_threat.score;
            // FINISH UPDATING
            threats.push(threat)
            threat_number = threat_number + 1;
        });
    }

    // RETURN THREATS
    // IN CASE OF ERROR WITH LLM, THREATS WILL BE EMPTY AND STATUS WILL BE 403, 500 etc.
    return {
        threats: threats,
        status: res.data.status
    };
}
