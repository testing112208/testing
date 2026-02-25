import React from 'react';

declare module 'react' {
    interface ReactNodeArray extends Array<ReactNode> { }
    type ReactNode =
        | React.ReactElement
        | string
        | number
        | boolean
        | bigint
        | React.ReactPortal
        | Iterable<ReactNode>
        | null
        | undefined;
}
