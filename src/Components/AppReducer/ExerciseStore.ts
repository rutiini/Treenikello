// import { useReducer } from 'react';
// import ExerciseContext from './ExerciseContext';
// import { DefaultAppState, ExerciseReducer } from './ExerciseReducer';

// export default function ExerciseStore(props: unknown) {
//     const [state, dispatch] = useReducer(ExerciseReducer, DefaultAppState);
//     return (
//         <ExerciseContext.Provider value={[state, dispatch]}>
//             {props.children}
//         </ExerciseContext.Provider>
//     )
// }