"use strict";

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var deleteBtns = document.querySelectorAll(".jsDeleteBtn");
var commentNumber = document.getElementById("jsCommentNumber");

var fakeDecreaseCount = function fakeDecreaseCount() {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};

var fakeDeleteComment = function fakeDeleteComment(commentId) {
  deleteBtns.forEach(function (btn) {
    if (btn.classList.contains(commentId)) {
      btn.parentElement.remove();
      fakeDecreaseCount();
    }
  });
};

var deleteComment =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(commentId) {
    var videoId, response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            videoId = window.location.href.split("/videos/")[1];
            _context.next = 3;
            return (0, _axios.default)({
              url: "/api/".concat(videoId, "/delete-comment"),
              method: "POST",
              data: {
                commentId: commentId
              }
            });

          case 3:
            response = _context.sent;
            console.log(response);

            if (response.status === 200) {
              fakeDeleteComment(commentId);
            }

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function deleteComment(_x) {
    return _ref.apply(this, arguments);
  };
}();

var handleClick = function handleClick(event) {
  var target = event.target;
  console.log(target.classList[target.classList.length - 1]);
  var commentId = target.classList[target.classList.length - 1];
  deleteComment(commentId);
};

function init() {
  deleteBtns.forEach(function (deleteBtn) {
    deleteBtn.addEventListener("click", handleClick);
  });
}

if (deleteBtns) {
  init();
}