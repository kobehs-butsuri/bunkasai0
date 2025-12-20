/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    output: 'export',
    trailingSlash: true,
    webpack(config) {
        const fileLoaderRule = config.module.rules.find((rule) =>
            rule.test?.test?.('.svg'),
        );

        config.module.rules.push(
            {
                ...fileLoaderRule,
                test: /\.svg$/i,
                resourceQuery: /url/,
            },
            {
                test: /\.svg$/i,
                issuer: fileLoaderRule.issuer,
                resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
                use: [
                    {
                        loader: '@svgr/webpack',
                        options: {
                            svgoConfig: {
                                plugins: [
                                    {
                                        name: 'preset-default',
                                        params: {
                                            overrides: {
                                                cleanupIds: false,
                                                convertShapeToPath: false,
                                                collapseGroups: false,
                                                removeUnknownsAndDefaults: {
                                                    keepRoleAttr: true,
                                                },
                                                removeEmptyContainers: false,
                                            },
                                        },
                                    },
                                ],
                            },
                            prettier: false,
                            svgProps: {
                            },
                        },
                    },
                ],
            },
        );

        fileLoaderRule.exclude = /\.svg$/i;

        return config;
    }
}

module.exports = nextConfig