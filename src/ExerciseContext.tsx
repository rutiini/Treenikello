import * as React from 'react';
import { IExerciseContext } from './DataInterfaces';

const ctx = React.createContext<IExerciseContext | null>(null);

/**
 * Context provider is used to set up the context on the top level.
 */
export const ExerciseContextProvider = ctx.Provider;

/**
 * Context consumer can be used to provide the context for a component. 
 * Usage of the {@link withExerciseContext} method is preferred.
 */
export const ExerciseContextConsumer = ctx.Consumer;

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * This higher order component injects the exercise context consumer to the components props.
 * Use it with the export statement:
 * export withExerciseContext(Component) 
 * @param Component 
 */
export function withExerciseContext<
  P extends { exerciseContext?: IExerciseContext },
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