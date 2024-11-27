"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpValidator = void 0;
class otpValidator {
    static async validateUserOtp(req, res, next) {
        try {
            const now = Date.now();
            console.log(typeof now, "datetype");
            console.log(req.session, "sessionsss otp");
            if (!req.session.userOtpTime || (now - req.session.userOtpTime) > 60000) {
                req.session.userOtpTime = null;
                req.session.userEmailOtp = null;
                throw new Error('OTP expired retry');
            }
            next();
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}
exports.otpValidator = otpValidator;
