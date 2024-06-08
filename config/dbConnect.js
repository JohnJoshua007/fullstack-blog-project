const mongoose = require("mongoose");

const dbConnect = async () => {
  console.log(process.env);
  try {
    await mongoose.connect(
      "mongodb+srv://johnobed3108:oqDwknCLSTavRtvE@fullstack-blog-project.3sssojo.mongodb.net/fullstack-blog?retryWrites=true&w=majority&appName=fullstack-blog-project"
    );
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DB Connection Failed", error.message);
  }
};
dbConnect();
