import routes from "../routes";
import User from "../models/User";
import passport from "passport";
import aws from "aws-sdk";

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY
});

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "join" });
};
export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 }
  } = req;
  if (password !== password2) {
    req.flash("error", "Password don't match");
    res.status(400);
    res.render("join", { pageTitle: "join" });
  } else {
    // To Do: Register user
    try {
      const user = await User({
        name,
        email
      });
      await User.register(user, password);
      next();
    } catch (error) {
      console.log(error);
      res.redirect(routes.home);
    }
  }
};

export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "login" });
};
export const postLogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home,
  failureFlash: "Can't log in. Check email and/or password",
  successFlash: "Welcome"
});

export const logout = (req, res) => {
  req.flash("info", "Logged out, see you later");
  req.logout();
  res.redirect(routes.home);
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).populate("videos");
  res.render("userDetail", { pageTitle: "userDetail", user });
};

export const userDetail = async (req, res) => {
  const {
    params: { id }
  } = req;
  console.log(id);
  try {
    const user = await User.findById(id).populate("videos");
    res.render("userDetail", { pageTitle: "userDetail", user });
  } catch (error) {
    req.flash("error", "User not found");
    res.redirect(routes.home);
  }
};

export const getEditProfile = (req, res) =>
  res.render("editProfile", { pageTitle: "editProfile" });
export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file
  } = req;
  try {
    if (file) {
      // Delete previous avatar on aws s3
      const user = await User.findById(req.user.id);
      const avatarUrlArr = user.avatarUrl.split("/");
      const avatarUrl = avatarUrlArr[avatarUrlArr.length - 1];
      const params = {
        Bucket: "utubeclone/avatar",
        Key: avatarUrl
      };
      s3.deleteObject(params, (err, data) => {
        if (err) {
          console.log("delete file on s3 failed");
          console.log(err);
        } else {
          console.log("delete file on s3 succeded");
          console.log(data);
        }
      });
    }

    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? file.location : req.user.avatarUrl
    });
    req.flash("success", "Profile updated");
    res.redirect(routes.me);
  } catch (error) {
    console.log(error);
    req.flash("error", "Can't update profile");
    res.redirect(`/users${routes.editProfile}`);
  }
};

export const getChangePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "changePassword" });
export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 }
  } = req;
  try {
    if (newPassword !== newPassword1) {
      req.flash("error", "password doesn't match");
      res.status(400);
      res.redirect(`/users${routes.changePassword}`);
      return;
    }
    // changepassword is from passport
    await req.user.changePassword(oldPassword, newPassword);
    res.redirect(routes.me);
  } catch (error) {
    req.flash("error", "Can't change password");
    res.status(400);
    res.redirect(`/users${routes.changePassword}`);
  }
};
// GitHub
export const githubLogin = passport.authenticate("github", {
  successFlash: "Welcome",
  failureFlash: "Can't log in at this time"
});

export const githubLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, avatar_url: avatarUrl, name, email }
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.githubId = id;
      user.avatarUrl = avatarUrl;
      await user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postGithubLogIn = (req, res) => {
  res.redirect(routes.home);
};

// Facebook
export const facebookLogin = passport.authenticate("facebook", {
  successFlash: "Welcome",
  failureFlash: "Can't log in at this time"
});
export const facebookLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, name, email }
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.facebookId = id;
      user.avatarUrl = `https://graph.facebook.com/${id}/picture?type=large`;
      await user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      facebookId: id,
      avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};
export const postFacebookLogIn = (req, res) => {
  res.redirect(routes.home);
};
