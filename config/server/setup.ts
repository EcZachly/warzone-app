export function checkForAllEnvironmentVariables(): void {
    const requiredEnvironmentVariables = [
        'WARZONE_JWT_SECRET',
        'WARZONE_SENDGRID_API_KEY'
    ];

    const missingEnvironmentVariables = requiredEnvironmentVariables.filter((key) => !process.env[key]);

    if (missingEnvironmentVariables.length > 0) {
        throw new Error('The following environment variables are required and missing: ' + JSON.stringify(missingEnvironmentVariables));
    }
}


export default {
    checkForAllEnvironmentVariables
};