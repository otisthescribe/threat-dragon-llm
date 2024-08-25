import api from './api.js';

export const generateThreatsForDiagram = async function (diagram_data, cell_data, session){
    let res = await api.postAsync(`/api/threatmodel/generate/diagram`, { diagram_data, cell_data, session });
    return res.data;
}

export const generateThreatsForComponent = async function (component_data, session){
    let res = await api.postAsync(`/api/threatmodel/generate/component`, { component_data, session });
    return res.data;
}