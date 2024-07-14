import api from './api.js';

const generateThreatModel = function (component_data) {
    return api.postAsync(`/api/threatmodel/generate/model`, { component_data });
}

const generateThreatsForDiagram = function (component_data){
    return api.postAsync(`/api/threatmodel/generate/diagram`, { component_data });
}

const generateThreatsForComponent = async function (component_data){
    let res = await api.postAsync(`/api/threatmodel/generate/component`, { component_data });
    return res.data;
}

export default {
    generateThreatModel,
    generateThreatsForDiagram,
    generateThreatsForComponent
};
