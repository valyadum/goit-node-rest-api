import Jimp from "jimp";

export const NewAvatar = Jimp.read("avatar.png", (err, avatar) => {
    if (err) throw err;
   avatar
        .resize(250, 250) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write("avatarNew.jpg"); // save
});