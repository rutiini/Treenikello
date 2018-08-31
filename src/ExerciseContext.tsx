import * as React from 'react';
import { IExerciseContext } from './DataInterfaces';

const ctx = React.createContext<IExerciseContext | null>(null);

export const ExerciseContextProvider = ctx.Provider;

export const ExerciseContextConsumer = ctx.Consumer;

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export function withExerciseContext<
  P extends { exerciseContext?: any },
  R = Omit<P, "exerciseContext">
  >(
    Component: React.ComponentClass<P> | React.StatelessComponent<P>): React.SFC<R> {
  return function BoundComponent(props: R) {
    return (
      <ExerciseContextConsumer>
        {value => <Component {...props} exerciseContext={value} />}
      </ExerciseContextConsumer>
    );
  };
}