import { registerBidder, registerAuctioneer,login, userAllProfiles, validatePhoneOTP, resendOTP, updatePassword, resendResetPasswordOTP, resetPassword } from "../services/auth.service.js";
import * as responser from "../core/responser.js";

class authController {
    // register Bidder
    registerBidder = async (req, res) => {
        const reqData = req.body;
        const data = await registerBidder(reqData);
        console.log(data);
        return responser.send(201, `Successfully ${data.accountType} Register`, req, res, data);
    };

    // register Auctioneer
    registerAuctioneer = async (req, res) => {
        const reqData = req.body;
        const data = await registerAuctioneer(reqData);
        console.log(data);
        return responser.send(201, `Successfully ${data.accountType} Register`, req, res, data);
    };

    // validatePhoneOTP
    validatePhoneOTP = async (req, res) => {
        const reqData = req.body;
        const data = await validatePhoneOTP(reqData);
        console.log(data);
        return responser.send(200, "Successfully Validate Phone OTP", req, res, data);
    }

    // resend
    resendOTP = async (req, res) => {
        const reqData = req.body;
        const data = await resendOTP(reqData);
        console.log(data);
        return responser.send(200, `Successfully ${reqData.type} OTP Sent`, req, res, data);
    }

    // login 
    login = async (req, res) => {
        const reqData = req.body;
        const data = await login(reqData);
        console.log(data);
        return responser.send(200, `Successfully ${data.accountType} Login`, req, res, data);
    };

    // updatePassword 
    updatePassword = async (req, res) => {
        const reqData = req.body;
        reqData.userId = req.userId
        const data = await updatePassword(reqData);
        console.log(data);
        return responser.send(200, "Successfully password updated", req, res, data);
    };

    // resetPassword
    resetPassword = async (req, res) => {
        const reqData = req.body;
        const data = await resetPassword(reqData);
        console.log(data);
        return responser.send(200, "Successfully password reseted", req, res, data);
    };

    // resendResetPasswordOTP
    resendResetPasswordOTP = async (req, res) => {
        const reqData = req.body;
        const data = await resendResetPasswordOTP(reqData);
        console.log(data);
        return responser.send(200, "Successfully password OTP sent!", req, res, data);
    };

    profile = async (req, res) => {
        const userId = req.userId;
        const data = await userAllProfiles(userId);
        console.log(data);
        return responser.send(
            200,
            `Successfully ${data.accountType} Profile Fetched`,
            req,
            res,
            data
        );
    };
}

export default new authController();
