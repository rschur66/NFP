const SET_EXPERIMENT   = 'SET_EXPERIMENT';

export default function reducer(state = {}, action){
    switch(action.type){
        case SET_EXPERIMENT:
            return action.payload;
        default:
            return state;
    }
}


export function setExperiment(experiment){
    return {
        type: SET_EXPERIMENT,
        payload: experiment
    }
}
