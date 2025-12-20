/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    output: 'export',
    trailingSlash: true,
    turbopack: {},
    images: {
        disableStaticImages: true,
    },
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

        return config;
    }
}

module.exports = nextConfig