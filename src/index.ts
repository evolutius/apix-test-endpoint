import {ApiXConfig, ApiXDataManager, ApiXManager} from '@evolutius/apix';
import {ApiXClearanceLevelDeterminator} from '@evolutius/apix';
import {ApiXClearanceLevel} from '@evolutius/apix';
import {ApiXMethod} from '@evolutius/apix';
import {Request} from 'express';
import {Response} from 'express';

const globalDataConfig = {
    apiKey: '92e42e068f8f5ee625ba59e7e7144d74c24618b9631f75d70ee3cc1faa7060f1',
    appKey: 'NTgxZWYxOWQ1YWYxNTgxOWFiY2E3YWUwY2QxNDk0M2IwNjJlM2M0MmU4YmEwMzRhMTUwNWEzN2I4ZTU3ZmJkMQ=='
}

class MyDeterminator implements ApiXClearanceLevelDeterminator {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    determine(appMethod: ApiXMethod, req: Request): ApiXClearanceLevel {
        return ApiXClearanceLevel.CL0;
    }
}

class MyDataManager implements ApiXDataManager {
    config: {[key: string] : string};
    constructor() {
        this.config = {};
        this.config[globalDataConfig.apiKey] = globalDataConfig.appKey;
    }

    getAppKeyForApiKey(apiKey: string): string {
        return this.config[apiKey];
    }

    getUserIdForSessionId(sessionId: string): string {
        return sessionId ? 'UID' : '';
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testEndpoint(req: Request, res: Response): unknown {
    return {
        success: true,
        message: 'This is a test endpoint with a successful response.'
    };
}

const testEndpointMethod: ApiXMethod = {
    entity: 'test',
    method: 'endpoint',
    requestHandler: testEndpoint
};

const determinator = new MyDeterminator();
const dataManager = new MyDataManager();
const appConfig = new ApiXConfig();

const appManager = new ApiXManager(determinator, dataManager, appConfig);

appManager.registerAppMethod(testEndpointMethod);

appManager.run();
