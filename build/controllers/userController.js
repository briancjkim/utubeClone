"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postFacebookLogIn = exports.facebookLoginCallback = exports.facebookLogin = exports.postGithubLogIn = exports.githubLoginCallback = exports.githubLogin = exports.postChangePassword = exports.getChangePassword = exports.postEditProfile = exports.getEditProfile = exports.userDetail = exports.getMe = exports.logout = exports.postLogin = exports.getLogin = exports.postJoin = exports.getJoin = void 0;

var _routes = _interopRequireDefault(require("../routes"));

var _User = _interopRequireDefault(require("../models/User"));

var _passport = _interopRequireDefault(require("passport"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var s3 = new _awsSdk.default.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY
});

var getJoin = function getJoin(req, res) {
  res.render("join", {
    pageTitle: "join"
  });
};

exports.getJoin = getJoin;

var postJoin =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res, next) {
    var _req$body, name, email, password, password2, user;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password, password2 = _req$body.password2;

            if (!(password !== password2)) {
              _context.next = 7;
              break;
            }

            req.flash("error", "Password don't match");
            res.status(400);
            res.render("join", {
              pageTitle: "join"
            });
            _context.next = 20;
            break;

          case 7:
            _context.prev = 7;
            _context.next = 10;
            return (0, _User.default)({
              name: name,
              email: email
            });

          case 10:
            user = _context.sent;
            _context.next = 13;
            return _User.default.register(user, password);

          case 13:
            next();
            _context.next = 20;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](7);
            console.log(_context.t0);
            res.redirect(_routes.default.home);

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[7, 16]]);
  }));

  return function postJoin(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.postJoin = postJoin;

var getLogin = function getLogin(req, res) {
  res.render("login", {
    pageTitle: "login"
  });
};

exports.getLogin = getLogin;

var postLogin = _passport.default.authenticate("local", {
  failureRedirect: _routes.default.login,
  successRedirect: _routes.default.home,
  failureFlash: "Can't log in. Check email and/or password"
});

exports.postLogin = postLogin;

var logout = function logout(req, res) {
  req.flash("info", "Logged out, see you later");
  req.logout();
  res.redirect(_routes.default.home);
};

exports.logout = logout;

var getMe =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res) {
    var user;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _User.default.findById(req.user.id).populate("videos");

          case 2:
            user = _context2.sent;
            res.render("userDetail", {
              pageTitle: "userDetail",
              user: user
            });

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getMe(_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getMe = getMe;

var userDetail =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res) {
    var id, user;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = req.params.id;
            console.log(id);
            _context3.prev = 2;
            _context3.next = 5;
            return _User.default.findById(id).populate("videos");

          case 5:
            user = _context3.sent;
            res.render("userDetail", {
              pageTitle: "userDetail",
              user: user
            });
            _context3.next = 13;
            break;

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](2);
            req.flash("error", "User not found");
            res.redirect(_routes.default.home);

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[2, 9]]);
  }));

  return function userDetail(_x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();

exports.userDetail = userDetail;

var getEditProfile = function getEditProfile(req, res) {
  return res.render("editProfile", {
    pageTitle: "editProfile"
  });
};

exports.getEditProfile = getEditProfile;

var postEditProfile =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(req, res) {
    var _req$body2, name, email, file, user, avatarUrlArr, avatarUrl, params;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _req$body2 = req.body, name = _req$body2.name, email = _req$body2.email, file = req.file;
            _context4.prev = 1;

            if (!file) {
              _context4.next = 10;
              break;
            }

            _context4.next = 5;
            return _User.default.findById(req.user.id);

          case 5:
            user = _context4.sent;
            avatarUrlArr = user.avatarUrl.split("/");
            avatarUrl = avatarUrlArr[avatarUrlArr.length - 1];
            params = {
              Bucket: "utubeclone/avatar",
              Key: avatarUrl
            };
            s3.deleteObject(params, function (err, data) {
              if (err) {
                console.log("delete file on s3 failed");
                console.log(err);
              } else {
                console.log("delete file on s3 succeded");
                console.log(data);
              }
            });

          case 10:
            _context4.next = 12;
            return _User.default.findByIdAndUpdate(req.user.id, {
              name: name,
              email: email,
              avatarUrl: file ? file.location : req.user.avatarUrl
            });

          case 12:
            req.flash("success", "Profile updated");
            res.redirect(_routes.default.me);
            _context4.next = 21;
            break;

          case 16:
            _context4.prev = 16;
            _context4.t0 = _context4["catch"](1);
            console.log(_context4.t0);
            req.flash("error", "Can't update profile");
            res.redirect("/users".concat(_routes.default.editProfile));

          case 21:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 16]]);
  }));

  return function postEditProfile(_x8, _x9) {
    return _ref4.apply(this, arguments);
  };
}();

exports.postEditProfile = postEditProfile;

var getChangePassword = function getChangePassword(req, res) {
  return res.render("changePassword", {
    pageTitle: "changePassword"
  });
};

exports.getChangePassword = getChangePassword;

var postChangePassword =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(req, res) {
    var _req$body3, oldPassword, newPassword, newPassword1;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _req$body3 = req.body, oldPassword = _req$body3.oldPassword, newPassword = _req$body3.newPassword, newPassword1 = _req$body3.newPassword1;
            _context5.prev = 1;

            if (!(newPassword !== newPassword1)) {
              _context5.next = 7;
              break;
            }

            req.flash("error", "password doesn't match");
            res.status(400);
            res.redirect("/users".concat(_routes.default.changePassword));
            return _context5.abrupt("return");

          case 7:
            _context5.next = 9;
            return req.user.changePassword(oldPassword, newPassword);

          case 9:
            res.redirect(_routes.default.me);
            _context5.next = 17;
            break;

          case 12:
            _context5.prev = 12;
            _context5.t0 = _context5["catch"](1);
            req.flash("error", "Can't change password");
            res.status(400);
            res.redirect("/users".concat(_routes.default.changePassword));

          case 17:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[1, 12]]);
  }));

  return function postChangePassword(_x10, _x11) {
    return _ref5.apply(this, arguments);
  };
}(); // GitHub


exports.postChangePassword = postChangePassword;

var githubLogin = _passport.default.authenticate("github", {
  successFlash: "Welcome",
  failureFlash: "Can't log in at this time"
});

exports.githubLogin = githubLogin;

var githubLoginCallback =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(_, __, profile, cb) {
    var _profile$_json, id, avatarUrl, name, email, user, newUser;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _profile$_json = profile._json, id = _profile$_json.id, avatarUrl = _profile$_json.avatar_url, name = _profile$_json.name, email = _profile$_json.email;
            _context6.prev = 1;
            _context6.next = 4;
            return _User.default.findOne({
              email: email
            });

          case 4:
            user = _context6.sent;

            if (!user) {
              _context6.next = 11;
              break;
            }

            user.githubId = id;
            user.avatarUrl = avatarUrl;
            _context6.next = 10;
            return user.save();

          case 10:
            return _context6.abrupt("return", cb(null, user));

          case 11:
            _context6.next = 13;
            return _User.default.create({
              email: email,
              name: name,
              githubId: id,
              avatarUrl: avatarUrl
            });

          case 13:
            newUser = _context6.sent;
            return _context6.abrupt("return", cb(null, newUser));

          case 17:
            _context6.prev = 17;
            _context6.t0 = _context6["catch"](1);
            return _context6.abrupt("return", cb(_context6.t0));

          case 20:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[1, 17]]);
  }));

  return function githubLoginCallback(_x12, _x13, _x14, _x15) {
    return _ref6.apply(this, arguments);
  };
}();

exports.githubLoginCallback = githubLoginCallback;

var postGithubLogIn = function postGithubLogIn(req, res) {
  res.redirect(_routes.default.home);
}; // Facebook


exports.postGithubLogIn = postGithubLogIn;

var facebookLogin = _passport.default.authenticate("facebook", {
  successFlash: "Welcome",
  failureFlash: "Can't log in at this time"
});

exports.facebookLogin = facebookLogin;

var facebookLoginCallback =
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(_, __, profile, cb) {
    var _profile$_json2, id, name, email, user, newUser;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _profile$_json2 = profile._json, id = _profile$_json2.id, name = _profile$_json2.name, email = _profile$_json2.email;
            _context7.prev = 1;
            _context7.next = 4;
            return _User.default.findOne({
              email: email
            });

          case 4:
            user = _context7.sent;

            if (!user) {
              _context7.next = 11;
              break;
            }

            user.facebookId = id;
            user.avatarUrl = "https://graph.facebook.com/".concat(id, "/picture?type=large");
            _context7.next = 10;
            return user.save();

          case 10:
            return _context7.abrupt("return", cb(null, user));

          case 11:
            _context7.next = 13;
            return _User.default.create({
              email: email,
              name: name,
              facebookId: id,
              avatarUrl: "https://graph.facebook.com/".concat(id, "/picture?type=large")
            });

          case 13:
            newUser = _context7.sent;
            return _context7.abrupt("return", cb(null, newUser));

          case 17:
            _context7.prev = 17;
            _context7.t0 = _context7["catch"](1);
            return _context7.abrupt("return", cb(_context7.t0));

          case 20:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[1, 17]]);
  }));

  return function facebookLoginCallback(_x16, _x17, _x18, _x19) {
    return _ref7.apply(this, arguments);
  };
}();

exports.facebookLoginCallback = facebookLoginCallback;

var postFacebookLogIn = function postFacebookLogIn(req, res) {
  res.redirect(_routes.default.home);
};

exports.postFacebookLogIn = postFacebookLogIn;