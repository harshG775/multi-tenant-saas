import React, { Fragment } from "react";

type ComponentConfig<Props> = {
    defaultProps: Props;
    render: (props: Props) => React.ReactNode;
};

export type Config<T extends Record<string, any>> = {
    components: {
        [K in keyof T]: ComponentConfig<T[K]>;
    };
};

// RENDER
export type Data<Components = Record<string, any>> = {
    root: { props: {} };
    content: {
        id: string;
        type: string;
        props?: Partial<Components[keyof Components]>;
    }[];
};
export function Render<Components extends Record<string, any>>({
    config,
    data,
}: {
    config: Config<Components>;
    data: Data<Components>;
}) {
    const { content } = data;

    if (!content || content.length === 0) {
        return <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>No content to display</div>;
    }

    return (
        <>
            {content.map((block) => {
                const component = config.components[block.type as keyof Components];

                if (!component) {
                    return (
                        <div
                            key={block.id}
                            style={{
                                color: "red",
                                padding: "10px",
                                border: "1px solid red",
                                margin: "5px 0",
                            }}
                        >
                            Unknown block type: {block.type}
                        </div>
                    );
                }

                type BlockKey = keyof Components;
                const props = {
                    ...component.defaultProps,
                    ...(block.props ?? {}),
                } as Components[BlockKey];

                // Simple try-catch for error handling
                try {
                    return <Fragment key={block.id}>{component.render(props)}</Fragment>;
                } catch (error) {
                    console.error(`Error rendering block ${block.type}:`, error);
                    return (
                        <div
                            key={block.id}
                            style={{
                                color: "orange",
                                padding: "10px",
                                border: "1px solid orange",
                                margin: "5px 0",
                            }}
                        >
                            Error rendering: {block.type}
                        </div>
                    );
                }
            })}
        </>
    );
}
