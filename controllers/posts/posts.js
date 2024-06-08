const Post = require("../../models/post/Post");
const appErr = require("../../utils/appErr");
const User = require("../../models/user/User");
//create
const createPostCtrl = async (req, res, next) => {
  const { title, description, category, user } = req.body;
  try {
    if (!title || !description || !category || !req.file) {
      return res.render("posts/addPost", {
        error: "All fields are required",
      });
    }

    //find the user
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    //Create the post
    const postCreated = await Post.create({
      title,
      description,
      category,
      user: userFound._id,
      image: req.file.path,
    });
    //push the post created into the array of user's posts
    userFound.posts.push(postCreated._id);
    //re save
    await userFound.save();
    //redirect
    res.redirect("/");
  } catch (error) {
    return res.render("posts/addPost", {
      error: error.message,
    });
  }
};

//all
const fetchPostsCtrl = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("comments").populate("user");
    res.json({
      status: "success",
      data: posts,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

//details
const fetchPostCtrl = async (req, res, next) => {
  try {
    //get the details from params
    const id = req.params.id;
    //find the post
    const post = await Post.findById(id)
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      })
      .populate("user");
    res.render("posts/postDetails", {
      post,
      error: "",
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

//delete
const deletePostCtrl = async (req, res, next) => {
  try {
    //find the post
    const post = await Post.findById(req.params.id);
    //check if the post belongs to the user
    if (post.user.toString() != req.session.userAuth.toString()) {
      return res.render("posts/postDetails", {
        error: "You are not allowed to delete this post",
        post,
      });
    }

    //delete post
    await Post.findByIdAndDelete(req.params.id);
    //redirect
    res.redirect("/");
  } catch (error) {
    return res.render("posts/postDetails", {
      error: error.message,
      post: "",
    });
  }
};

//update
const updatePostCtrl = async (req, res, next) => {
  const { title, description, category } = req.body;
  try {
    //find the post
    const post = await Post.findById(req.params.id);
    //check if the post belongs to the user
    if (post.user.toString() != req.session.userAuth.toString()) {
      return res.render("posts/updatePost", {
        post: "",
        error: "You are not authorized to update this post",
      });
    }
    //check if user is updating the image
    if (req.file) {
      await Post.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          category,
          image: req.file.path,
        },
        {
          new: true,
        }
      );
    } else {
      //update post
      await Post.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          category,
        },
        {
          new: true,
        }
      );
    }

    //redirect
    res.redirect("/");
  } catch (error) {
    return res.render("posts/updatePost", {
      post: "",
      error: error.message,
    });
  }
};

module.exports = {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  deletePostCtrl,
  updatePostCtrl,
};

// const Post = require("../../models/post/Post");
// const User = require("../../models/user/User");
// const appErr = require("../../utils/appErr");
// //create
// // const createPostCtrl = async (req, res, next) => {
// //   // console.log(req.file);

// //   const { title, description, category } = req.body;
// //   try {
// //     if (!title || !description || !category) {
// //       console.log("Reached");
// //       return next(appErr("All fields are required"));
// //     }
// //     //Find the user
// //     const userId = req.session.userAuth;
// //     const userFound = await User.findById(userId);
// //     //Create the post
// //     const postCreated = await Post.create({
// //       title,
// //       description,
// //       category,
// //       user: userFound._id,
// //       image: req.file.path,
// //     });

// //     console.log("POST CREATED", postCreated);
// //     //push the post created into the array of user's posts
// //     userFound.posts.push(postCreated._id);
// //     //re save
// //     await userFound.save();
// //     res.json({
// //       status: "success",
// //       data: postCreated,
// //     });
// //   } catch (error) {
// //     next(appErr(error.message));
// //   }
// // };

// //create post
// const createPostCtrl = async (req, res, next) => {
//   console.log(req.file);
//   console.log(req.body);
//   const { title, description, category, user } = req.body;
//   try {
//     if (!title || !description || !category || !req.file) {
//       return next(appErr("All fields are required"));
//     }
//     //Find the user
//     const userId = req.session.userAuth;
//     const userFound = await User.findById(userId);
//     //Create the post
//     const postCreated = await Post.create({
//       title,
//       description,
//       category,
//       user: userFound._id,
//       image: req.file.path,
//     });
//     //push the post created into the array of user's posts
//     userFound.posts.push(postCreated._id);
//     //re save
//     await userFound.save();
//     res.json({
//       status: "success",
//       data: postCreated,
//     });
//   } catch (error) {
//     next(appErr(error.message));
//   }
// };

// //all
// const fetchPostsCtrl = async (req, res, next) => {
//   try {
//     const posts = await Post.find().populate("comments");
//     res.json({
//       status: "success",
//       data: posts,
//     });
//   } catch (error) {
//     next(appErr(error.message));
//   }
// };

// //details
// const fetchPostCtrl = async (req, res, next) => {
//   try {
//     //get the id from params
//     const id = req.params.id;
//     //find the post
//     const post = await Post.findById(id).populate("comments");
//     res.json({
//       status: "success",
//       data: post,
//     });
//   } catch (error) {
//     next(appErr(error.message));
//   }
// };

// //delete
// const deletePostCtrl = async (req, res, next) => {
//   try {
//     //find the post
//     const post = await Post.findById(req.params.id);
//     //check if the post belongs to the user
//     if (post.user.toString() !== req.session.userAuth.toString()) {
//       return next(appErr("You are not allowed to delete this post", 403));
//     }
//     //delete post
//     await Post.findByIdAndDelete(req.params.id);
//     res.json({
//       status: "success",
//       data: "Post has been deleted successfully",
//     });
//   } catch (error) {
//     next(appErr(error.message));
//   }
// };

// //update
// const updatePostCtrl = async (req, res, next) => {
//   const { title, description, category } = req.body;
//   try {
//     //find the post
//     const post = await Post.findById(req.params.id);
//     //check if the post belongs to the user
//     if (post.user.toString() !== req.session.userAuth.toString()) {
//       return next(appErr("You are not allowed to update this post", 403));
//     }
//     //update
//     const postUpdated = await Post.findByIdAndUpdate(
//       req.params.id,
//       {
//         title,
//         description,
//         category,
//         image: req.file.path,
//       },
//       {
//         new: true,
//       }
//     );

//     res.json({
//       status: "success",
//       data: postUpdated,
//     });
//   } catch (error) {
//     res.json(error);
//   }
// };
// module.exports = {
//   createPostCtrl,
//   fetchPostsCtrl,
//   fetchPostCtrl,
//   deletePostCtrl,
//   updatePostCtrl,
// };
