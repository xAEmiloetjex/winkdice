// const bcrypt = require("bcrypt")
// exports.cryptPassword = function (password, callback) {
//     bcrypt.genSalt(10, function (err, salt) {
//         if (err)
//             return callback(err);
//         bcrypt.hash(password, salt, function (err, hash) {
//             return callback(err, hash);
//         });
//     });
// };

// exports.comparePassword = function (plainPass, hashword, callback) {
//     bcrypt.compare(plainPass, hashword, function (err, isPasswordMatch) {
//         return err == null ? callback(null, isPasswordMatch) : callback(err);
//     });
// };

import bcrypt from "bcryptjs"

export const encrypt = (pswd:string): any => bcrypt.hashSync(pswd, bcrypt.genSalt(16, (err,salt) => salt))
export const isSame = (pswd:string, hash:string): any => bcrypt.compareSync(pswd, hash)