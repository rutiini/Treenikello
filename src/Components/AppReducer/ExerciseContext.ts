import React from "react";
import { DefaultAppState, IAction, IAppState } from "./ExerciseReducer";

const ExerciseContext = React.createContext<[IAppState, React.Dispatch<IAction>]>([DefaultAppState, () => void 0]);

export default ExerciseContext;
