import next from 'next';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


type generateNextConfigProps = {
    directory: string,
    dev: boolean,
    port: any,
}


//ts-expect-error
export function generateNextConfig({directory, dev, port}: generateNextConfigProps): any {
    const typescriptLoader = {
        test: /\.ts(x?)$/,
        use: 'ts-loader',
        exclude: /node_modules/
    };

    return next({
        dev,
        dir: directory,
        conf: {
            pageExtensions: ['tsx', 'ts', 'js', 'jsx'],
            webpack: (config, options) => {
                config.module.rules.push(typescriptLoader);

                return config;
            },
            env: {
                WARZONE_DATABASE_URL: process.env.WARZONE_DATABASE_URL,
                WARZONE_EMAIL: process.env.WARZONE_EMAIL,
                WARZONE_PASSWORD: process.env.WARZONE_PASSWORD,
                WARZONE_RECAPTCHA_SITE_KEY: process.env.WARZONE_RECAPTCHA_SITE_KEY,
                WARZONE_RECAPTCHA_SECRET_KEY: process.env.WARZONE_RECAPTCHA_SECRET_KEY,
                NEXT_PUBLIC_WARZONE_RECAPTCHA_SITE_KEY: process.env.WARZONE_RECAPTCHA_SITE_KEY,
                PORT: port
            },
            api: {
                bodyParser: {
                    sizeLimit: '500kb'
                }
            }
        }
    });
}