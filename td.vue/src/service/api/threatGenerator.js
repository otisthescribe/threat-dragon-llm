import api from './api.js';

const generateThreatModel = function (component_data, session) {
    return api.postAsync(`/api/threatmodel/generate/model`, { component_data, session });
}

const generateThreatsForDiagram = function (component_data, session){
    return api.postAsync(`/api/threatmodel/generate/diagram`, { component_data, session });
}

const generateThreatsForComponent = async function (component_data, session){
    let res = await api.postAsync(`/api/threatmodel/generate/component`, { component_data, session });
    return res.data;
}

export default {
    generateThreatModel,
    generateThreatsForDiagram,
    generateThreatsForComponent
};
