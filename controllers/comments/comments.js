const Post = require("../../models/post/Post");
const User = require("../../models/user/User");
const Comment = require("../../models/comment/Comment");
const appErr = require("../../utils/appErr");

//create comment
const createCommentCtrl = async (req, res, next) => {
  const { message } = req.body;
  try {
    //find the post
    const post = await Post.findById(req.params.id);
    console.log(post);
    //create the comment
    const comment = await Comment.create({
      user: req.session.userAuth,
      message,
      post: post._id,
    });
    //push the comment into the post
    post.comments.push(comment._id);
    //find the user
    const user = await User.findById(req.session.userAuth);
    //push the comment into the user
    user.comments.push(comment._id);
    //disable validation
    //save
    await post.save({ validateBeforeSave: false });
    await user.save({ validateBeforeSave: false });
    console.log(post);
    //redirect
    res.redirect(`/api/v1/posts/${post._id}`);
  } catch (error) {
    next(appErr(error));
  }
};

//single
const commentDetailsCtrl = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    res.render("comments/updateComment", {
      comment,
      error: "",
    });
  } catch (error) {
    res.render("comments/updateComment", {
      error: error.message,
    });
  }
};

//delete
const deleteCommentsCtrl = async (req, res, next) => {
  console.log(req.query.postId);
  try {
    //find the post
    const comment = await Comment.findById(req.params.id);
    //check if the post belongs to the user
    if (comment.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("You are not allowed to delete this comment", 403));
    }
    //delete post
    await Comment.findByIdAndDelete(req.params.id);
    //redirect
    res.redirect(`/api/v1/posts/${req.query.postId}`);
  } catch (error) {
    next(appErr(error));
  }
};

//update
const updateCommentsCtrl = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log(req.params.id);
    //find the comment
    const comment = await Comment.findById(req.params.id);
    console.log("comment", comment);
    console.log("user session", req.session.userAuth.toString());
    //check if the comment belongs to the user
    if (comment.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("You are not allowed to update this comment", 403));
    }
    //update
    const commentUpdated = await Comment.findByIdAndUpdate(
      req.params.id,
      {
        message: req.body.message,
      },
      {
        new: true,
      }
    );

    console.log("updated", commentUpdated);

    //redirect
    res.redirect(`/api/v1/posts/${req.query.postId}`);
  } catch (error) {
    next(appErr(error));
  }
};

module.exports = {
  createCommentCtrl,
  commentDetailsCtrl,
  deleteCommentsCtrl,
  updateCommentsCtrl,
};
