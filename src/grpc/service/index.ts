import {
    handleUnaryCall,
    status as grpcStatus
} from "@grpc/grpc-js";

import {
    VerifyReq,
    VerifyResp
} from "../stub/token_auth_pb";

import {
    TokenAuthService,
    ITokenAuthServer
} from "../stub/token_auth_grpc_pb";

import * as tokenServ from '../../service/token';

class TokenAuthServer implements ITokenAuthServer {
    [name: string]: import("@grpc/grpc-js").UntypedHandleCall;
    verifyAccessToken: handleUnaryCall<VerifyReq, VerifyResp> = async (
        call,
        callback,
    ) => {
        const { request } = call; // get request object
        // validate request | middleware >>>
        let invalid = false;
        if (invalid) {
            return callback({
                code: grpcStatus.INVALID_ARGUMENT,
                name: "Invalid Request",
                message: "Bad request: the argument was not provided",
            });
        }
        // <<< validate request | middleware
        const response: VerifyResp = new VerifyResp();
        const token = request.getToken();
        const valid = await tokenServ.verifyAccessToken(token);
        response.setResult(valid);
        callback(null, response);
    };
};

export { TokenAuthService, TokenAuthServer }
