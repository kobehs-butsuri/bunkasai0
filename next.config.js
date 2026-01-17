/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    output: 'export',
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    turbopack: {},
    images: {
        disableStaticImages: false,
        unoptimized: true
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
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
                ref: true,
            },
        });
        return config;
    }
}

module.exports = nextConfig