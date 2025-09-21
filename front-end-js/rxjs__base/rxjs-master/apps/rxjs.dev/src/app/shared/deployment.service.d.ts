import { LocationService } from 'app/shared/location.service';
/**
 * Information about the deployment of this application.
 */
export declare class Deployment {
    private location;
    /**
     * The deployment mode set from the environment provided at build time;
     * or overridden by the `mode` query parameter: e.g. `...?mode=archive`
     */
    mode: string;
    constructor(location: LocationService);
}
