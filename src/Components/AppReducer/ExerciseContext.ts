import React, { useReducer } from "react";
import { DefaultAppState, ExerciseReducer, IAction, IAppState } from "./ExerciseReducer";

// TODO: we need to call the hook within a functional component
// tslint:disable-next-line: react-hooks-nesting -> combining usereducer and usecontext intentionally!
const [state, dispatch] = useReducer(ExerciseReducer, DefaultAppState);

const ExerciseContext = React.createContext<[IAppState,React.Dispatch<IAction>]>([state, dispatch]);

export default ExerciseContext;