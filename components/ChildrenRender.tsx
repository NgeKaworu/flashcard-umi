import type { ReactElement } from 'react';

 const ChildrenRender = <T extends unknown>  ({
  children,
  ...props
}: {
  children: (props: T) => ReactElement;
}) => children?.(props as T);

export default ChildrenRender