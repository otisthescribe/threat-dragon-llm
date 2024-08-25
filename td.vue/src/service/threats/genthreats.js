import { generateThreatsForDiagram, generateThreatsForComponent } from '../api/threatGenerator.js';
import { createNewTypedThreat } from './index.js'

export const createNewGeneratedThreatsForComponent = async (modelType, cellRefData, start_number, session) => {
    let data = await generateThreatsForComponent(JSON.stringify(cellRefData), session);
    let gen_threats = data.threats;
    let threat, threats = [], number = start_number;

    gen_threats.forEach((gen_threat) => {
        threat = createNewTypedThreat(modelType, cellRefData.type, number);
        // UPDATE THREAT HERE
        threat.title = gen_threat.title;
        threat.description = gen_threat.description;
        threat.severity = gen_threat.severity;
        threat.mitigation = gen_threat.mitigation;
        threat.score = gen_threat.score;
        // FINISH UPDATING
        threats.push(threat)
        number = number + 1;
    });
    return threats;
}

export const createNewGeneratedThreatsForDiagram = async (diagram, cell, start_number, session) => {
    let data, gen_threats, number = start_number;
    let threat, threats = []
    let diagram_data = {
        title: diagram.title,
        description: diagram.description
    }
    data = await generateThreatsForDiagram(JSON.stringify(diagram_data), JSON.stringify(cell.data), session);
    gen_threats = data.threats;

    gen_threats.forEach((gen_threat) => {
        threat = createNewTypedThreat(diagram.diagramType, cell.type, number);
        // UPDATE THREAT HERE
        threat.title = gen_threat.title;
        threat.description = gen_threat.description;
        threat.severity = gen_threat.severity;
        threat.mitigation = gen_threat.mitigation;
        threat.score = gen_threat.score;
        // FINISH UPDATING
        threats.push(threat)
        number = number + 1;
    });
    return threats;
}