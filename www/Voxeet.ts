import UserInfo from "./UserInfo";

/*
 *
 * Voxeet ConferenceKit Cordova
 * Copyright (C) 2018
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
*/

/**
 * This class enable interaction with Voxeet ConferenceKit
 * @constructor
 */
const exec:any = require('cordova/exec');
const SERVICE:string = 'Voxeet';

enum RTCPMode {
    WORST = "worst",
    BEST = "best"
}

enum Mode {
    STANDARD = "standard",
    PUSH = "push"
}

enum Codec {
    VP8 = "VP8",
    H264 = "H264"
}

interface CreateParameters {
    ttl?: number;
    rtcpMode?: RTCPMode; //best / worst, default => worst
    mode?: Mode; // push / standard, default => standard
    videoCodec?: Codec; //default VP8
    liveRecording?: boolean; //default false
}

interface CreateOptions {
    alias?: string;
    params?: CreateParameters;
}

interface CreateParameters {
    ttl?: number;
    rtcpMode?: RTCPMode; //best / worst, default => worst
    mode?: Mode; // push / standard, default => standard
    videoCodec?: Codec; //default VP8
    liveRecording?: boolean; //default false
}

interface CreateOptions {
    alias?: string;
    params?: CreateParameters;
}

enum UserType {
    USER = "user",
    LISTENER = "listener"
}

interface JoinUserInfo {
    type?:  UserType;
}

interface JoinOptions {
    user?: JoinUserInfo;
}

interface RefreshCallback {
    (): void;
};

interface TokenRefreshCallback {
    (): Promise<string>
};

class Voxeet {

    refreshAccessTokenCallback: RefreshCallback|null = null;
    refreshToken: TokenRefreshCallback|undefined; 

    constructor() {
        this.refreshAccessTokenCallback = () => {
            this.refreshToken && this.refreshToken()
            .then(accessToken => this.onAccessTokenOk(accessToken))
            .catch(err => {
                console.log(err);
                this.onAccessTokenKo("Error while refreshing token");
           });
        }
    }

    initialize(consumerKey: string, consumerSecret: string): Promise<any> {
        return new Promise((resolve, reject) => {
            exec(resolve, reject, SERVICE, 'initialize', [consumerKey, consumerSecret]);
        });
    }

    initializeToken(accessToken: string|undefined, refreshToken: TokenRefreshCallback) {
        return new Promise((resolve, reject) => {
            this.refreshToken = refreshToken;
            exec(this.refreshAccessTokenCallback, (err) => {}, SERVICE, 'refreshAccessTokenCallback', []);
            exec(resolve, reject, SERVICE, 'initializeToken', [accessToken]);
        });
    }

    connect(userInfo: UserInfo): Promise<any> {
        return new Promise((resolve, reject) => {
            exec(resolve, reject, SERVICE, 'connect', [userInfo.json()]);
        });
    }

    disconnect(): Promise<any>  {
        return new Promise((resolve, reject) => {
            exec(resolve, reject, SERVICE, 'disconnect', []);
        });
    }

    create(options: CreateOptions): Promise<any> {
        return new Promise((resolve, reject) => {
            exec(resolve, reject, SERVICE, 'create', [options]);
        });
    }

    join(conferenceId: string, options: JoinOptions = {}): Promise<any>  {
        return new Promise((resolve, reject) => {
            exec(resolve, reject, SERVICE, 'join', [conferenceId, options]);
        });
    }

    leave(): Promise<any>  {
        return new Promise((resolve, reject) => {
            exec(resolve, reject, SERVICE, 'leave', []);
        });
    }

    invite(conferenceId: string, participants: UserInfo[]): Promise<any> {
        const array = participants ? participants.map(e => e.json()) : null;
        return new Promise((resolve, reject) => {
            exec(resolve, reject, SERVICE, 'invite', [conferenceId, array]);
        });
    }

    sendBroadcastMessage(message: string): Promise<any> {
        return new Promise((resolve, reject) => {
            exec(null, null, SERVICE, 'sendBroadcastMessage', [message]);
            resolve();
        });
    }

    appearMaximized(enabled: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            exec(null, null, SERVICE, 'appearMaximized', [enabled]);
            resolve();
        });
    }

    defaultBuiltInSpeaker(enabled: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            exec(null, null, SERVICE, 'defaultBuiltInSpeaker', [enabled]);
            resolve();
        });
    }

    defaultVideo(enabled: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            exec(null, null, SERVICE, 'defaultVideo', [enabled]);
            resolve();
        });
    }

    /*
     *  Android methods
     */

    screenAutoLock(enabled: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            exec(null, null, SERVICE, 'screenAutoLock', [enabled]);
            resolve();
        });
    }

    isUserLoggedIn(): Promise<boolean> {
        return new Promise((resolve, reject) => exec(resolve, reject, SERVICE, 'isUserLoggedIn', []));
    }

    checkForAwaitingConference(): Promise<any> {
        return new Promise((resolve, reject) => exec(resolve, reject, SERVICE, 'checkForAwaitingConference', []));
    }

    /*
     *  Deprecated methods
     */

    startConference(conferenceId: string, participants: Array<UserInfo>): Promise<any> {
        const array = participants ? participants.map(e => e.json()) : null;
        return new Promise((resolve, reject) => {
            exec(resolve, reject, SERVICE, 'startConference', [conferenceId, array]);
        });
    }

    stopConference(): Promise<any> {
        return new Promise((resolve, reject) => exec(resolve, reject, SERVICE, 'stopConference', []));
    }

    openSession(userInfo: UserInfo): Promise<any> {
        return new Promise((resolve, reject) => {
            exec(resolve, reject, SERVICE, 'openSession', [userInfo.json()]);
        });
    }

    closeSession(): Promise<any> {
        return new Promise((resolve, reject) => exec(resolve, reject, SERVICE, 'closeSession', []));
    }

    //method to refresh tokens, used internally
    onAccessTokenOk (accessToken: string) {
      return new Promise((resolve, reject) => {
        exec(resolve, reject, SERVICE, 'onAccessTokenOk', [accessToken]);
      });
    }

    onAccessTokenKo (errorMessage: string) {
      return new Promise((resolve, reject) => {
        exec(resolve, reject, SERVICE, 'onAccessTokenKo', [errorMessage]);
      });
    }
}

export = new Voxeet();
//export default new Voxeet(); // will be available through Voxeet not voxeet -> fake 'singleton'
