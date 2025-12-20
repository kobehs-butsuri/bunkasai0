declare module '*.svg' {
    import type { FC, SVGProps } from 'react';
    const content: FC<SVGProps<SVGElement>>;
    export default content;
}

declare module '*.svg?url' {
    // biome-ignore lint/suspicious/noExplicitAny: any is required here
    const content: unknown;
    export default content;
}