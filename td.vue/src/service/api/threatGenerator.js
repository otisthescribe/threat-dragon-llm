import api from './api.js';

export const generateThreatsForComponent = async function (cell_data, session){
    return await api.postAsync(`/api/threatmodel/generate/component`, { cell_data, session });
}

export const generateThreatsForDiagram = async function (diagram_data, cell_data, session){
    return await api.postAsync(`/api/threatmodel/generate/diagram`, { diagram_data, cell_data, session });
}

export const generateThreatsForThreatModel = async function (threatmodel_data, diagram_data, cell_data, session){
    return await api.postAsync(`/api/threatmodel/generate/threatmodel`, { threatmodel_data, diagram_data, cell_data, session });
}