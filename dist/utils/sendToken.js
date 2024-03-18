var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const sendToken = (res_1, user_1, message_1, ...args_1) => __awaiter(void 0, [res_1, user_1, message_1, ...args_1], void 0, function* (res, user, message, statusCode = 200) {
    const token = yield user.generateToken();
    const options = {
        httpOnly: true,
        expires: new Date(Date.now() +
            parseInt(`${process.env.COOKIE_EXPIRE}`) * 24 * 60 * 60 * 1000),
        secure: true,
        sameSite: "none",
    };
    res.cookie("token", token, options).status(statusCode).json({
        success: true,
        message,
        user,
    });
});
