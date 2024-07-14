import threatGenerator from '../api/threatGenerator.js';
import { createNewTypedThreat } from './index.js'

export const createNewGeneratedThreats = async (modelType, cellRefData, start_number) => {
    let gen_threats = await threatGenerator.generateThreatsForComponent(JSON.stringify(cellRefData));

    let threat;
    let threats = [];
    let number = start_number;
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