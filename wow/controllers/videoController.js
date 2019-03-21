import routes from "../routes";
import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";
import aws from "aws-sdk";

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY
});

// Home
export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    console.log(error);
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};

// Search
export const search = async (req, res) => {
  const {
    query: { term: searchingBy }
  } = req;
  let videos = [];
  try {
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" }
    });
  } catch (error) {
    console.log(error);
  }
  res.render("search", { pageTitle: "search", searchingBy, videos });
};

// Upload
export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "upload" });
export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { location }
  } = req;
  const newVideo = await Video.create({
    fileUrl: location,
    title,
    description,
    creator: req.user.id
  });
  req.flash("success", "Uploaded video");
  req.user.videos.push(newVideo.id);
  await req.user.save();
  res.redirect(routes.videoDetail(newVideo.id));
};

// Video Detail
export const videoDetail = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id)
      .populate("creator")
      .populate({
        path: "comments",
        populate: {
          path: "creator",
          model: User
        }
      });

    res.render("videoDetail", { pageTitle: "videoDetail", video });
  } catch (error) {
    res.redirect(routes.home);
  }
};

// Edit Video
export const getEditVideo = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    if (String(video.creator) !== req.user.id) {
      throw Error();
    } else {
      res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
    }
  } catch (error) {
    res.redirect(routes.home);
  }
};
export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description }
  } = req;
  try {
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    req.flash("success", "Edited video");
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    req.flash("error", "Can't edit video");
    res.redirect(routes.home);
  }
};

// Delete Video
export const deleteVideo = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    const creator = await User.findById(video.creator);
    if (String(video.creator) !== req.user.id) {
      throw Error();
    } else {
      // Delete file on aws s3
      const fileUrlArr = video.fileUrl.split("/");
      const fileUrl = fileUrlArr[fileUrlArr.length - 1];
      const params = {
        Bucket: "utubeclone/video",
        Key: fileUrl
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

      await Video.findOneAndRemove({ _id: id });
      creator.videos.remove(video.id);
      await creator.save();
      req.flash("success", "Deleted video");
    }
  } catch (error) {
    req.flash("error", "Can't delete video");
    console.log(error);
  }
  res.redirect(routes.home);
};

export const postRegisterView = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    video.views += 1;
    await video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  }
  res.end();
};

export const postAddComment = async (req, res) => {
  try {
    const {
      body: { comment },
      params: { id }
    } = req;
    const video = await Video.findById(id);
    const newComment = await Comment.create({
      text: comment,
      creator: req.user.id
    });
    video.comments.push(newComment);
    await video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const postDeleteComment = async (req, res) => {
  try {
    const {
      params: { id },
      body: { commentId }
    } = req;
    const video = await Video.findById(id);
    video.comments.splice(video.comments.indexOf(commentId), 1);

    await video.save();
    const user = await User.findById(req.user.id);
    user.comments.splice(user.comments.indexOf(commentId), 1);
    await user.save();
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};
